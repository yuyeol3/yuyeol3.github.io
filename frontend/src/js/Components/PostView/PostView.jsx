import { useParams } from "react-router-dom";
import { getPost } from "../../Services/getPosts.js";
import {useState, useEffect} from "react";
import ReactMarkdown from "react-markdown";
import {Helmet} from "react-helmet";

import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import remarkGfm from "remark-gfm";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
// Prism 스타일을 사용할 경우, 아래와 같이 스타일을 임포트합니다.
// import { prism as codeStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { github as codeStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// hljs용 언어들을 개별로 import
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import cpp from "react-syntax-highlighter/src/languages/hljs/cpp.js";
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';

// 언어 등록 (필요한 언어만 등록)
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('java', java);

import "../../../css/markdown.css";
import "../../../css/post_view.css"

import TableOfContents from "./TableOfContents.jsx";
import PostHeader from "./PostHeader.jsx";
import HeadingRenderer from "./HeadingRenderer.jsx";
import Comment from "../Commons/Comment.jsx";


export default function PostView() {
    const { "*" : href } = useParams();
    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        getPost(href)
            .then(post=>{
                console.log("postView post:", post.pathList.join("-"));
                setPost(post);
            })
            .catch(err=>{
                setError(err);
            })
            .finally(()=>{
                setLoading(false);
            })
    }, [href]);

    if (loading) return <p>Loading...</p>;
    if (error) return <h2>Error fetching markdown: {error.message}</h2>;

    return (
        <div className="post-view">
            <Helmet>
                <title>{post.title}</title>
            </Helmet>
            <PostHeader post={post}/>
            {post.titleContents.length > 0 ?
                <TableOfContents post={post}></TableOfContents> :
                <></>
            }
            <hr className="hr"></hr>
            <div className="markdown-body">
                <ReactMarkdown
                    components={{
                        // 코드 블록 렌더러 추가
                        code({ node, inline, className, children, ...props }) {
                            // className 예: "language-js" 형태로 전달됨
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={codeStyle}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        },
                        // 기존 헤딩 커스텀 렌더러
                        h1: (props) => <HeadingRenderer level={1} {...props} />,
                        h2: (props) => <HeadingRenderer level={2} {...props} />,
                        h3: (props) => <HeadingRenderer level={3} {...props} />,
                        h4: (props) => <HeadingRenderer level={4} {...props} />,
                        h5: (props) => <HeadingRenderer level={5} {...props} />,
                        h6: (props) => <HeadingRenderer level={6} {...props} />,
                    }}
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeKatex]}
                >
                    {post.content}
                </ReactMarkdown>
            </div>
            <hr className="hr"></hr>
            <h2>Comments</h2>
            <Comment term={post.fileName}></Comment>
        </div>
    )
}