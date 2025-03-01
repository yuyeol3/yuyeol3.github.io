// comment.tsx
import {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import NotFound from "./NotFound.jsx";
import Loading from "./Loading.jsx";

export default function Comment({term}) {
    const commentsEl = useRef(null);
    const [status, setStatus] = useState("pending");

    useEffect(() => {
        const scriptEl = document.createElement("script");
        scriptEl.onload = ()=>{
            commentsEl.current
                ?.querySelector(".utterances-frame")
                ?.addEventListener("load", ()=>setInterval(()=>setStatus("success"),500)
            );
        };
        scriptEl.onerror = ()=>setStatus("failed");
        scriptEl.async = true;
        scriptEl.src = "https://utteranc.es/client.js";
        scriptEl.setAttribute("repo", "yuyeol3/yuyeol3.github.io");
        scriptEl.setAttribute("theme", "github-light");
        scriptEl.setAttribute("crossorigin", "anonymous");
        scriptEl.setAttribute("issue-term", term);
        commentsEl.current?.appendChild(scriptEl);
    }, [term]);


    return (
        <div className="comments-wrapper">
            {status === "pending" ? <Loading/> : ""}
            {status === "failed" ? <NotFound/> : ""}
            <div ref={commentsEl} />
        </div>
    );
}

Comment.propTypes = {
    term : PropTypes.string.isRequired
}
