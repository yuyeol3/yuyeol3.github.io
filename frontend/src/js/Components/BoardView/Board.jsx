
import PropTypes from "prop-types";
import PostPreview from "./PostPreview.jsx";
import {useNavigate} from "react-router-dom";

import "../../../css/board.css"

export default function Board({title, posts, page, pageSize}) {
    const navigate = useNavigate();
    const pageNum = page;
    const from = (pageNum-1) * pageSize < 0 ? 0 : (pageNum-1) * pageSize;
    const to = (pageNum) * pageSize >= posts.length ? posts.length  : (pageNum) * pageSize;
    console.log("posts:", posts);
    let res = posts.slice(from, to).map(
        (o)=>
            <PostPreview
                title={o.title}
                date={o.date}
                preview={o.preview}
                key={o.path}
                onClick={()=>navigate(`/post-view/${o.path}`)}
            />
    );
    console.log(res);

    return (
        <div className="board">
            <h1>{title}</h1>
            <div className="post-previews">
                {res.length ?
                    res :
                    <p>결과가 없습니다.</p>
                }
            </div>
        </div>
    );
}

Board.propTypes = {
    title: PropTypes.string.isRequired,
    posts: PropTypes.array.isRequired,
    page : PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
}