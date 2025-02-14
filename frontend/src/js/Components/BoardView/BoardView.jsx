import {useParams, useNavigate, useSearchParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";

import NotFound from "../Commons/NotFound.jsx";
import Board from "./Board.jsx";
import SearchBar from "./SearchBar.jsx";
import {Helmet} from "react-helmet";
import PostsContext from "../../Contexts/PostsContext.jsx";
import Loading from "../Commons/Loading.jsx";
import settings from "../../settings.js";

const pageSize = settings.boardView.pageSize;

export default function BoardView() {
    // const navigate = useNavigate();
    // const { name, page } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [name, setName] = useState(searchParams?.get("name"));
    const [page, _setPage] = useState(searchParams?.get("page"));
    const {posts, loading, error} = useContext(PostsContext);
    const [targetBoard, setTargetBoard] = useState(posts[name] || null);
    const [pSize, setPSize] = useState(pageSize);
    const pageNum = parseInt(page);

    useEffect(() => {
        // navigate(`/board-view/${name}/${page}`);
        const name = searchParams?.get("name");
        const page = searchParams?.get("page");
        if (posts && name) setTargetBoard(posts[name]);
        setPSize(pageSize);
        setName(name);
        _setPage(page);

    }, [posts, searchParams]);


    // 페이지 업데이트를 라우트 변경으로 추상화
    function setPage(num) {
        // navigate(`/board-view?name=${name}&page=${num}`);
        //
        // setName(name);
        // _setPage(num);
        setSearchParams({name : name, page : num});
    }



    // 로딩 중 표시
    if (loading || (!name && !page)) return (<Loading/>)
    if (!targetBoard || error || !name) return (<NotFound/>)
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

