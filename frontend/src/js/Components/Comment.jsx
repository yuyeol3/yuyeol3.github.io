// comment.tsx
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

export default function Comment({term}) {
    const commentsEl = useRef(null);

    useEffect(() => {
        const scriptEl = document.createElement("script");
        scriptEl.async = true;
        scriptEl.src = "https://utteranc.es/client.js";
        scriptEl.setAttribute("repo", "yuyeol3/yuyeol3.github.io");
        scriptEl.setAttribute("issue-term", "url");
        scriptEl.setAttribute("theme", "github-light");
        scriptEl.setAttribute("crossorigin", "anonymous");
        scriptEl.setAttribute("issue-term", term);
        commentsEl.current?.appendChild(scriptEl);
    }, []);

    return (
        <div>
            <div ref={commentsEl} />
        </div>
    );
}

Comment.propTypes = {
    term : PropTypes.string.isRequired
}
