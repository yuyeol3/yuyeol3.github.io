// 새 글 스캐폴딩: 카테고리를 고르고 제목을 입력하면 오늘 날짜로 파일을 만들어 준다.
// 대화형:   npm run new
// 비대화형: npm run new -- "<category>" "<title>"   (예: npm run new -- 개발/PS "백준 1234 문제")
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

// posts/ 아래에서 .md 를 직접 담고 있는 카테고리 폴더들의 상대경로를 수집
function getCategoryDirs() {
  const dirs = new Set();
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && path.extname(entry.name) === ".md") {
        dirs.add(path.relative(postsDirectory, directory).replace(/\\/g, "/"));
      }
    }
  };
  walk(postsDirectory);
  return [...dirs].sort((a, b) => a.localeCompare(b, "ko"));
}

// 제목 → 파일명 슬러그 (한글 유지, 공백→하이픈, 파일시스템/URL 부적합 문자 제거)
function slugify(title) {
  return title
    .trim()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function todayISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 대화형으로 카테고리 선택 + 제목 입력을 받는다 (argv 로 주어지지 않은 값만).
async function promptMissing(categoryArg, titleArg) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

  try {
    let category = categoryArg;
    if (!category) {
      const categories = getCategoryDirs();
      console.log("카테고리를 선택하세요 (번호), 또는 새 경로를 직접 입력하세요 (예: 개발/새카테고리):\n");
      categories.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
      console.log("");
      const choice = (await ask("카테고리 > ")).trim();
      const index = Number.parseInt(choice, 10);
      category =
        Number.isInteger(index) && index >= 1 && index <= categories.length
          ? categories[index - 1]
          : choice;
    }

    let title = titleArg;
    if (!title) {
      title = (await ask("제목 > ")).trim();
    }

    return { category, title };
  } finally {
    rl.close();
  }
}

function createPost(categoryInput, titleInput) {
  const category = categoryInput.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "").trim();
  if (!category) {
    throw new Error("카테고리가 비어 있습니다.");
  }
  // posts/<category>/<file> 또는 posts/<group>/<category>/<file> 만 허용 (디렉토리 depth 1~2)
  if (category.split("/").length > 2) {
    throw new Error(`카테고리 경로는 최대 2단계입니다(그룹/카테고리): ${category}`);
  }

  const title = titleInput.trim();
  if (!title) {
    throw new Error("제목이 비어 있습니다.");
  }

  const slug = slugify(title);
  if (!slug) {
    throw new Error(`제목에서 파일명을 만들 수 없습니다: ${title}`);
  }

  const fileName = `${todayISO()}-${slug}.md`;
  const targetDir = path.join(postsDirectory, category);
  const filePath = path.join(targetDir, fileName);

  if (fs.existsSync(filePath)) {
    throw new Error(`이미 존재합니다: ${path.relative(process.cwd(), filePath)}`);
  }

  fs.mkdirSync(targetDir, { recursive: true });
  const content = `${matter.stringify("", { title, description: "" }).trimEnd()}\n\n`;
  fs.writeFileSync(filePath, content);

  const leafCategory = category.split("/").at(-1);
  const url = `/posts/${encodeURIComponent(leafCategory)}/${encodeURIComponent(path.basename(fileName, ".md"))}/`;

  return { filePath, url };
}

async function main() {
  const [, , categoryArg, titleArg] = process.argv;
  const { category, title } = await promptMissing(categoryArg, titleArg);
  const { filePath, url } = createPost(category, title);

  console.log("\n생성 완료:");
  console.log(`  파일: ${path.relative(process.cwd(), filePath).replace(/\\/g, "/")}`);
  console.log(`  URL : ${url}`);
}

main().catch((error) => {
  console.error(`\n오류: ${error.message}`);
  process.exit(1);
});
