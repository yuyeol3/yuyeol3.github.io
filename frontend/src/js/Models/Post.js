export default class Post {

    /**
     * @param {string} markdownText
     * @param {string[]} pathList
     */
    constructor(markdownText, pathList) {
        this.markdownText = markdownText;
        this.pathList = pathList;
        const parsedObj = Post.parse(markdownText, pathList);

        this.title = parsedObj.title;
        this.date = parsedObj.date;
        this.content = parsedObj.content;
        this.titleContents = parsedObj.titleContents;
    }

    /**
     * @param {string} markdownText
     * @param {string[]} pathList
     * @returns {{
     *      title : string,
     *      date : string,
     *      content : string,
     *      titleContents : {
     *          title : string,
     *          headerIndex : number,
     *          level : number
 *          }[]
     * }}
     */
    static parse(markdownText, pathList) {
        const lines = markdownText.split('\n');
        const title = (lines[0].startsWith('#') ?
                             lines[0].replace('#', '') :
                             'No Title');

        const fileName = pathList.at(-1)
        let date;
        if (/^\d{4}-\d{2}-\d{2}/.test(fileName)) {
            date = fileName.match(/^\d{4}-\d{2}-\d{2}/)[0];
        }
        else throw new Error("could not parse date");
        const content = lines.slice(1).join('\n');
        const titleContents = Post.analyzeHeaders(content.split('\n'));

        return {
            title, date, content, titleContents
        }
    }

    /**
     * @param {string[]} lines
     * @return {{
     *    title : string,
     *    headerIndex : number,
     *    level : number
     * }[]}
     */
    static analyzeHeaders(lines) {
        let isCodeArea = false;

        return lines
            .filter((line) => {
                if (line.includes('```'))
                    isCodeArea = !isCodeArea;
                return line.startsWith('#') && !isCodeArea;
            })
            .map((line, idx) => {
                const title = line.trimEnd().replace(/[#* ]+/, '')
                // console.log(title.replace(/\s+/g, '-'));
                return {
                    title,
                    id : title.replace(/\s+/g, '-'),
                    headerIndex : idx,
                    level : (line.split(' ')[0].match(/#/g) || []).length
                }
        });
    }


}