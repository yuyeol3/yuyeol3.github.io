import {useState} from "react";
import PropTypes from "prop-types";

export default function PostPreview({title, date, preview, onClick}) {
    return (<div className="post-preview" onClick={onClick}>
            <h2>{title}</h2>
            <p>{date}</p>
            <p>{preview}</p>
        </div>
    )
}

PostPreview.propTypes = {
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    preview: PropTypes.string,
    onClick: PropTypes.func.isRequired
}