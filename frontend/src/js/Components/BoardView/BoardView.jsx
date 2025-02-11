import { useParams, useNavigate } from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";

import NotFound from "../Commons/NotFound.jsx";
import Board from "./Board.jsx";
import SearchBar from "./SearchBar.jsx";
import {Helmet} from "react-helmet";
import PostsContext from "../../Contexts/PostsContext.jsx";

const pageSize = 10;

export default function BoardView() {
    const navigate = useNavigate();
    const { name, page } = useParams();
    const {posts, loading, error} = useContext(PostsContext);
    // const [posts, setPosts] = useState(window.posts || null);
    // const [loading, setLoading] = useState(!(posts));
    const [targetBoard, setTargetBoard] = useState(null);
    const [pSize, setPSize] = useState(pageSize);

    const pageNum = parseInt(page);

    // 페이지 업데이트를 라우트 변경으로 추상화
    function setPage(num) {
        navigate(`/board-view/${name}/${num}`);
    }

    useEffect(() => {
        // navigate(`/board-view/${name}/${page}`);
        if (posts)
            setTargetBoard(posts[name]);
        setPSize(pageSize);
    }, [posts, page, name, navigate]);

    // 로딩 중 표시
    if (loading) return (<p>Loading...</p>)
    if (!targetBoard || error) return (<NotFound/>)
    return (
        <div className="board-view">
            <Helmet>
                <title>게시판 : {name}</title>
            </Helmet>
            <SearchBar
                searchRange={posts[name]}
                autofocus={false}
                setTargetBoard={setTargetBoard}
                setPSize={setPSize}
            />
            <Board
                key={`${name},${pageNum}`}
                title={name}
                posts={targetBoard}
                page={pageNum}
                pageSize={pSize}
            />
            <div className="button-area">
                <button onClick={
                    () => {
                        page - 1 > 0 ?
                            setPage(pageNum - 1) : null
                    }
                }>prev
                </button>
                {pageNum}
                <button onClick={
                    () => {
                        (pageNum + 1) * pageSize < targetBoard.length + pageSize ?
                            setPage(pageNum + 1) : null
                    }}>
                    next
                </button>
            </div>
        </div>
    );
}

