import {useParams, useSearchParams} from "react-router-dom";
import { getPost } from "../../Services/getPosts.js";
import {useState, useEffect} from "react";
import ReactMarkdown from "react-markdown";
import {Helmet} from "react-helmet";

import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// Prism 스타일을 사용할 경우, 아래와 같이 스타일을 임포트합니다.
import { prism as codeStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';

// 색깔 정의
const customCodeStyle = {
    ...codeStyle,
    "pre[class*=\"language-\"]": {
        ...codeStyle["pre[class*=\"language-\"]"],
        background: "#f6f8fa" // 여기서 배경색을 변경합니다.
    },
};


import "../../../css/markdown.css";
import "../../../css/post_view.css"

import TableOfContents from "./TableOfContents.jsx";
import PostHeader from "./PostHeader.jsx";
import HeadingRenderer from "./HeadingRenderer.jsx";
import Comment from "../Commons/Comment.jsx";
import rehypeRaw from "rehype-raw";
import FloatMenu from "./FloatMenu.jsx";


export default function PostView() {
    // const { "*" : href } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [href, setHref] = useState(searchParams.get("href"));
    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    console.log(href);
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
            <FloatMenu href={href}></FloatMenu>
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
                                    style={customCodeStyle}
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
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                >
                    {post.content}
                </ReactMarkdown>
            </div>
            <hr className="hr"></hr>
            <div className="post-comments">
                <h2>Comments</h2>
                <Comment term={post.fileName}></Comment>
            </div>
        </div>
    )
}