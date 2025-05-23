import {useState, useEffect} from "react";
import PropTypes from "prop-types";

import PostsContext from "../../Contexts/PostsContext.jsx";
import {getPosts} from "../../Services/getPosts.js";
import settings from "../../settings.js";

// posts 데이터는 전역 객체가 되는 게 맞는 것 같다.
async function setPostsData(setPosts, setLoading, setError, showLoading=false) {
    try {
        // 잦은 페이지 변경 및 깜빡임 방지
        if (showLoading) setLoading(true);
        const posts =  await getPosts();
        setPosts(posts);
    } catch (err) {
        console.error(err);
        setError(err);
    } finally {
        if (showLoading) setLoading(false);
    }
}


export function PostsProvider({ children }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        setPostsData(setPosts, setLoading, setError, true);
        const intervalId = setInterval(
            () => {setPostsData(setPosts, setLoading, setError)},
            settings.postProvider.updateMin * 60 * 1000
        )
        return ()=>{clearInterval(intervalId);}
    }, []);

    return (
        <PostsContext.Provider value={{posts, loading, error}}>
            {children}
        </PostsContext.Provider>
    )
}

PostsProvider.propTypes = {
    children: PropTypes.node.isRequired,
}