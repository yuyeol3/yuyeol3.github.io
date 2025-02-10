import { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { getPosts } from "./Services/getPosts.js";
import PropTypes from 'prop-types';

import '../css/App.css';
import menu_icon from '../assets/menu-icon.svg';

import Main from './Components/Main/Main.jsx';
import PostView from "./Components/PostView/PostView.jsx";
import BoardView from "./Components/BoardView/BoardView.jsx";

import NotFound from "./Components/NotFound.jsx";

function Header({onClick}) {
    return (
        <div className="header">
            <button className='menu-button' onClick={onClick}>
                <img src={menu_icon} alt="menu-icon" />
            </button>
            <Link to="/">yuyeol3.github.io</Link>
        </div>
    );
}

Header.propTypes = {
    onClick : PropTypes.func.isRequired
};


function Footer() {
    return (
        <div className="footer">
            <p>All rights reserved.</p>
        </div>
    );
}


function SideBar({ posts, menuDisplay }) {
    const navigate = useNavigate();

    const categories = posts
        ? Object.keys(posts).map((key) => (
            <div
                key={key}
                className="sidebar-item"
                onClick={() => {navigate(`/board-view/${key}/1`)}}
            >
                {key}
            </div>
        ))
        : null;

    if (menuDisplay) {
        return (

            <div className="side-bar">
                {categories ? categories : "Loading..."}
            </div>
        );
    }
    else {
        return (<></>);
    }

}

SideBar.propTypes = {
    posts: PropTypes.object.isRequired, // isRequired로 수정
    menuDisplay : PropTypes.bool.isRequired
};

function App() {
    const [posts, setPosts] = useState(null);
    const [menuDisplay, setMenuDisplay] = useState( window.innerWidth > 768);


    useEffect(() => {
        getPosts()
            .then(posts => {
                setPosts(posts)
            })
            .catch(err=>{
                console.log(err);
            })
    }, []);

    // if (loading) {return (<p>loading...</p>)}

    return (
        <div className="App" id="App">
            <Router>
                <Header menuDisplay={menuDisplay}
                        onClick={()=>setMenuDisplay(!menuDisplay)} />
                {/* 사이드바와 메인 컨텐츠를 좌우로 배치 */}
                <div className="main-container">
                    <SideBar posts={posts} menuDisplay={menuDisplay} />
                    <div className="contents">
                        <Routes>
                            <Route path="/" element={<Main posts={posts}/>} />
                            <Route path="/board-view/:name/:page" element={<BoardView/>}/>
                            <Route path="/post-view/*" element={<PostView />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </div>
                </div>
                <Footer />
            </Router>
        </div>
    );
}

export default App;
