
import PropTypes from "prop-types";
import {useState} from "react";

export default function FloatMenu({href}) {
    const [copied, setCopied] = useState(false);

    const toTop = () => {
        window.scrollTo({top: 0, behavior: "smooth"});
    }

    const toBottom = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    }

    const copyLink = ()=> {
        if (!href) return;
        const shareLink = location.host + "/previews/" + href.split("/").join(".") + ".html";
        navigator.clipboard
            .writeText(shareLink)
            .then(() => {
                setCopied(true);
                // 2초 후 복사 표시(✅)를 다시 📋로 변경
                setTimeout(() => setCopied(false), 1000);
            })
            .catch((err) => {
                console.error("Failed to copy link:", err);
            });
    }
    return (
        <div className="float-menu">
            <button className="top" onClick={toTop}>↑</button>
            <button className="bottom" onClick={toBottom}>↓</button>
            <button className="share" onClick={copyLink}>{copied ? "✅" : "📋"}</button>
        </div>
    );
}

FloatMenu.propTypes = {
    href : PropTypes.string.isRequired,
}


