import { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { getPosts } from "./Services/getPosts.js";
import PropTypes from 'prop-types';
import {Helmet} from "react-helmet";

import '../css/App.css';
import menu_icon from '../assets/menu-icon.svg';
import search_icon from '../assets/search-icon.svg';

import Main from './Components/Main/Main.jsx';
import PostView from "./Components/PostView/PostView.jsx";
import BoardView from "./Components/BoardView/BoardView.jsx";
import SideBar from "./Components/Layouts/SideBar.jsx";
import NotFound from "./Components/NotFound.jsx";
import SearchView from "./Components/BoardView/SearchView.jsx";
import settings from "./settings.js";


function Header({onClick}) {
    return (
        <div className="header">
            <div className="header-left">
                <button className='menu-button' onClick={onClick}>
                    <img src={menu_icon} alt="menu-icon"/>
                </button>
                <Link to="/">yuyeol3.github.io</Link>
            </div>
            <div className="header-right">
                <Link to="/search-view">
                    <img src={search_icon} alt="search-icon"/>
                </Link>
            </div>
        </div>
    );
}

Header.propTypes = {
    onClick: PropTypes.func.isRequired
};


function Footer() {
    return (
        <div className="footer">
        <p>All rights reserved.</p>
        </div>
    );
}


function App() {
    const [posts, setPosts] = useState(null);
    const [menuDisplay, setMenuDisplay] = useState( window.innerWidth > settings.sidebar.hideCriteria);
    window.loadingStates.push((loading, posts)=> setPosts(posts));



    return (
        <div className="App" id="App">
            <Helmet>
                <meta charSet="utf-8"/>
                <link rel="canonical" href="http://yuyeol3.github.io/"/>
                <title>{"yuyeol3's blog"}</title>
            </Helmet>
            <Router>
                <Header menuDisplay={menuDisplay}
                        onClick={()=>setMenuDisplay(!menuDisplay)} />
                {/* 사이드바와 메인 컨텐츠를 좌우로 배치 */}
                <div className="main-container">

                    <SideBar posts={posts} menuDisplay={menuDisplay} setMenuDisplay={setMenuDisplay} />
                    <div className="contents">
                        <Routes>
                            <Route path="/" element={<Main posts={posts}/>} />
                            <Route path="/board-view/:name/:page" element={<BoardView/>}/>
                            <Route path="/search-view" element={<SearchView/>}/>
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
