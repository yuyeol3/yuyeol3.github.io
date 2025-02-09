import { useParams } from "react-router-dom";
import { getPost } from "../Services/getPosts.js";
import {useState, useEffect} from "react";
import ReactMarkdown from "react-markdown";
import React from "react";
import {Element} from "react-scroll";

import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

import remarkGfm from "remark-gfm";

import "../../css/markdown.css";
import "../../css/post_header.css"

import PropTypes from "prop-types";

import TableOfContents from "./TableOfContents.jsx";

function PostHeader({post}) {
    return (<div className="post-header">
        <h1>{post.title}</h1>
        <p className="posted-date">{post.date}</p>
    </div>)
}

PostHeader.propTypes = {
    post : PropTypes.object.isRequired
};


const HeadingRenderer = ({ level, children }) => {
    // 예시: 만약 markdown 파서에서 headerIndex를 알 수 없다면,
    // 혹은 별도의 id 생성 로직을 사용한다면 아래와 같이 처리
    // console.log(level, children);
    const headerText = children.toString();
    // 실제로는 파서에서 headerIndex를 받아 id로 "header-{headerIndex}"를 부여해야 함
    // const id = headerText.replace(/\s+/g, '-').toLowerCase();
    const id = headerText.replace(/\s+/g, '-');
    console.log(id);
    return (
        <Element id={id} name={id}>
            {React.createElement(`h${level}`, null, children)}
        </Element>
    )
};

HeadingRenderer.propTypes = {
    level: PropTypes.number.isRequired,
    children: PropTypes.node.isRequired
}


export default function PostView() {
    const { "*" : href } = useParams();
    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        getPost(href)
            .then(post=>{
                console.log(post);
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
    if (error) return <p>Error fetching markdown: {error.message}</p>;

    return (
        <div className="post-view">
            <PostHeader post={post} />
            <TableOfContents post={post}></TableOfContents>
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
        </div>
    )
}