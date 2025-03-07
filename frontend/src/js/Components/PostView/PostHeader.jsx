import PropTypes from "prop-types";
import settings from "../../settings.js";

export default function PostHeader({post}) {
    return (<div className="post-header">
        <h1>{post.title}</h1>
        <p className="posted-date">
            <i>
                by {settings.postHeader.author}, {post.date}
            </i>
        </p>
    </div>)
}

PostHeader.propTypes = {
    post : PropTypes.object.isRequired
};