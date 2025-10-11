import PropTypes from "prop-types";
import Board from "../BoardView/Board.jsx";
import Loading from "../Commons/Loading.jsx";
import {useContext} from "react";
import PostsContext from "../../Contexts/PostsContext.jsx";
import Comment from "../Commons/Comment.jsx";


export default function Main() {
    const {posts} = useContext(PostsContext);

    const postList = posts ?
        (()=>{
            const list = Object.values(posts);

            return list
                    .reduce((a,b) => a.concat(b), [])
                    .sort((a,b) => new Date(b.date) - new Date(a.date))

        })()
        : null;

    return (
        <>
            <h1>yuyeol3.github.io</h1>
            <p>블로그 방문을 환영합니다! 이 블로그는 React를 이용한 github pages 기반 블로그입니다.</p>
            {posts ?
                <Board title={"최근 게시글"} posts={postList} page={1} pageSize={5}/> :
                <Loading></Loading>
            }
            <div className="main-comments">
                <h2>방명록</h2>
                <Comment term="main"></Comment>
            </div>
        </>
    );
}

Main.propTypes = {
    // posts: PropTypes.object.isRequired,
}
