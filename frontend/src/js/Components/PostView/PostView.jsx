import { useParams } from "react-router-dom";
import { getPost } from "../../Services/getPosts.js";
import {useState, useEffect} from "react";
import ReactMarkdown from "react-markdown";


import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import remarkGfm from "remark-gfm";

import "../../../css/markdown.css";
import "../../../css/post_view.css"

import TableOfContents from "./TableOfContents.jsx";
import PostHeader from "./PostHeader.jsx";
import HeadingRenderer from "./HeadingRenderer.jsx";
import Comment from "../Comment.jsx";


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
            <PostHeader post={post} />
            {post.titleContents.length > 0 ?
                <TableOfContents post={post}></TableOfContents> :
                <></>
            }
            <hr className="hr"></hr>
            <div className="markdown-body">
                <ReactMarkdown
                    components={{
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
            <Comment term={post.fileName}></Comment>
        </div>
    )
}