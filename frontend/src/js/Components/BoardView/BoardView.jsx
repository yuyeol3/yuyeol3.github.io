import { useParams, useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import PropTypes from "prop-types";

import NotFound from "../NotFound.jsx";
import Board from "./Board.jsx";

const pageSize = 10;

export default function BoardView() {
    const navigate = useNavigate();
    const { name, page } = useParams();
    const [posts, setPosts] = useState(window.posts || null);
    const [loading, setLoading] = useState(!(posts));
    // 초기 로딩 시 업데이트
    window.loadingStates.push((stat, posts)=>{
        setPosts(posts);
        setLoading(stat);
    });
    // const [error, setError] = useState(null);
    // const [pageNum, setPage] = useState(page ? parseInt(page) : 1);
    const pageNum = parseInt(page);
    console.log(page);

    useEffect(() => {
        navigate(`/board-view/${name}/${page}`);
    }, [page, name, navigate]);

    if (loading) {
        return (<p>Loading...</p>)
    }

    const targetBoard = posts[name];

    if (!targetBoard) {
        return (<NotFound/>)
    }

    function setPage(num) {
        navigate(`/board-view/${name}/${num}`);
    }
    return (
        <div className="board-view">
            <Board
                key={`${name},${pageNum}`}
                title={name}
                posts={targetBoard}
                page={pageNum}
                pageSize={pageSize}/>
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

