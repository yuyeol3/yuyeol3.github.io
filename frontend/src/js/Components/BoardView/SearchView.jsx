import { useParams, useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import PropTypes from "prop-types";

import NotFound from "../NotFound.jsx";
import Board from "./Board.jsx";
import SearchBar from "./SearchBar.jsx";

const pageSize = 10;

export default function SearchView() {
    const [posts, setPosts] = useState(window.posts || null);
    const [loading, setLoading] = useState(!(posts));
    const [targetBoard, setTargetBoard] = useState(null);
    const [pSize, setPSize] = useState(pageSize);
    // 초기 로딩 시 업데이트
    window.loadingStates.push((stat, posts)=>{
        setPosts(posts);
        setLoading(stat);
    });

    useEffect(() => {
        // navigate(`/board-view/${name}/${page}`);
        if (posts) setTargetBoard([]);
        setPSize(pageSize);
    }, [posts]);

    // 로딩 중 표시
    if (loading) return (<p>Loading...</p>)
    if (!targetBoard) return (<NotFound/>)

    const searchRange = Object.values(posts).reduce((a, b)=>a.concat(b), []);
    console.log("searchRange:", searchRange);
    return (
        <div className="board-view">
            <SearchBar
                searchRange={searchRange}
                autofocus={true}
                setTargetBoard={setTargetBoard}
                setPSize={setPSize} />
            <Board
                key={pSize}
                title="검색"
                posts={targetBoard}
                page={1}
                pageSize={pSize}/>
        </div>
    );
}

