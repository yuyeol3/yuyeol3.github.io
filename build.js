// build.js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter'); // front-matter가 있다면 사용
const groupSetting = require('./build.groupsetting');
const marked = require('marked');

const postsDir = path.join(__dirname, 'posts');
const outputFile = path.join(__dirname, 'posts.html'); // React 앱에서 사용할 위치
const hostName = "yuyeol3.github.io";


// 재귀적으로 디렉토리 순회하는 함수
/**
 * @param {string} dir 
 * @returns {string[]}
 */
function getMarkdownFiles(dir) {
  let results = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      results = results.concat(getMarkdownFiles(fullPath));
    } else if (dirent.isFile() && path.extname(dirent.name) === '.md') {
      results.push(fullPath);
    }
  });
  return results;
}

/**
 * @param {string} filePath 
 * @returns {{
 *  path: string,
 *  pathList: string[],
 *  title: string,
 *  date: string,
 *  preview: string
 * }}
 */
function extractPostData(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  // front-matter가 있다면 파싱
  const { data, content: mdContent } = matter(content);
  
  // front-matter에 title이나 date가 없으면 첫 줄에서 제목 추출
  let title = data.title;
  if (!title) {
    const lines = mdContent.split('\n');
    const titleLine = lines.find(line => line.trim().startsWith('# '));
    title = titleLine ? titleLine.replace(/^#\s+/, '').trim() : 'No Title';
  }

  // 날짜는 파일명에서 추출 (예: 2025-02-08.md)
  const fileName = path.basename(filePath, '.md');
  let date = data.date;
  if (!date && /^\d{4}-\d{2}-\d{2}/.test(fileName)) {
    date = fileName.match(/^\d{4}-\d{2}-\d{2}/)[0];
  }

  // 미리보기: 제목 다음의 첫 번째 문단 (빈 줄을 기준으로 분리)
  const paragraphs = mdContent.split('\n').map(p => p.trim()).filter(p => p);
  // console.log(paragraphs);
  let preview = '';
  if (paragraphs.length > 1) {
    // 첫 번째 단락은 제목이 아닐 수 있으므로, 두 번째 단락을 미리보기로 사용
    preview = paragraphs[1].length > 200 ? paragraphs[1].slice(0, 200) + '...' : paragraphs[1];
  }

  // posts 폴더 이후의 상대 경로 (URL 생성 시 활용)
  const relativePath = path.relative(__dirname, filePath).replace(/\\/g, '/');

  return { path: relativePath, pathList: relativePath.split('/'), title, date, preview };
}


function classifyCategories(posts) {
  const groupSetting = posts.__groupSetting;
  const groupedCategories = [];

  for (const group in groupSetting) {
    const categories = groupSetting[group];
    groupedCategories.push(...categories);
  }
  // console.log(groupedCategories);
  const allCategories = Object.keys(posts);
  const noGroup = allCategories
    .filter((e)=> (
      groupedCategories.indexOf(e) === -1 &&
      e !== "__groupSetting"
    ));
  posts.__groupSetting.noGroup = noGroup;
  return posts;
}

function renderStaticHtml(posts) {
  const htmlTemplate = (title, content, path, description)=> `
      <html lang="ko">
      <head>
        <title>${title}</title>
        <link rel="canonical" href="http://${hostName}/"/>
        <meta charset="utf-8"/>
        <meta name="description" content="${description}">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body style="display : none;">
        
        ${marked.parse(content)}
        <script>
          location.href = "/post-view?href=${encodeURIComponent(path)}"
        </script>
      </body>
  `;

  // console.log(posts);
  for (const category of Object.keys(posts)) {
    const postList = posts[category];
    for (const post of postList) {
      const content = fs.readFileSync(__dirname +  "/" + post.pathList.join("/"))
      fs.writeFileSync("./previews/" + post.pathList.join(".") + ".html", 
      htmlTemplate(post.title, content.toString('utf-8'), post.pathList.join("/"), post.preview), 'utf-8');
    }
  }
}

function createSiteMap(posts) {
  const today = new Date();
  const urlTemplate = (url, date)=>`
    <url>
      <loc>${url}</loc>
      <lastmod>${date}</lastmod>
    </url>
  `

  let result = "";
  // console.log(posts);
  for (const category of Object.keys(posts)) {
    const postList = posts[category];
    for (const post of postList) {
      const content = post.pathList.join("/")
      result += urlTemplate(`https://${hostName}/post-view?href=${post.pathList.join("/")}`, post.date);
    }
    result += urlTemplate(`https://${hostName}/board-view?name=${category}&amp;page=1`, `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate()}`)
  }

  fs.writeFileSync(
    "./sitemap.xml",
    `
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
        ${urlTemplate(`https://${hostName}/`, `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate()}`)}
        ${urlTemplate(`https://${hostName}/board-view`, `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate()}`)}
        ${urlTemplate(`https://${hostName}/search-view`, `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate()}`)}
        ${result}
      </urlset>
    `, 
    'utf-8'
  );
}

/**
 * builds Posts Json
 * @returns {void}
 */
function buildPostsJson() {
  const files = getMarkdownFiles(postsDir);
  // 각 파일에 대해 메타 데이터 추출
  const posts = files.map(extractPostData);
  
  // 필요한 경우 폴더별 그룹화
  const grouped = {};
  posts.forEach(post => {
    // 예시로 posts/ 이후의 첫 폴더명을 카테고리로 사용
    const parts = post.path.split('/');
    const category = parts.length > 2 ? parts[1] : 'default';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(post);
  });
  
  // 그룹별로 최근에 작성된 글 순으로 정렬
  for (const category in grouped) {
    grouped[category].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  renderStaticHtml(grouped);
  createSiteMap(grouped);
  // 그룹 설정 추가
  grouped.__groupSetting = groupSetting;
  classifyCategories(grouped);
  // JSON으로 저장 (필요에 따라 grouped 혹은 posts 배열을 저장)
  fs.writeFileSync(outputFile, JSON.stringify(grouped, null, 2), 'utf-8');
  console.log(`Posts JSON saved to ${outputFile}`);
}

buildPostsJson();
