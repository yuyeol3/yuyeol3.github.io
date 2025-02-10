import PropTypes from "prop-types";

export default function PostHeader({post}) {
    return (<div className="post-header">
        <h1>{post.title}</h1>
        <p className="posted-date">{post.date}</p>
    </div>)
}

PostHeader.propTypes = {
    post : PropTypes.object.isRequired
};