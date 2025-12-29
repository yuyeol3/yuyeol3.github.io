import {useState} from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function PostPreview({title, date, preview, href}) {
    return (<Link className="post-preview" to={href}>
            <h3>{title}</h3>
            <p>{date}</p>
            <p>{preview}</p>
        </Link>
    )
}

PostPreview.propTypes = {
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    preview: PropTypes.string,
    onClick: PropTypes.func.isRequired
}