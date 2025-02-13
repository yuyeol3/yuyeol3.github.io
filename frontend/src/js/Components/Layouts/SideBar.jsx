import {useLocation, useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import {useContext, useEffect} from "react";
import settings from "../../settings.js";
import PostsContext from "../../Contexts/PostsContext.jsx";
import Loading from "../Commons/Loading.jsx";
import NotFound from "../Commons/NotFound.jsx";

function Category({name}) {
    const navigate = useNavigate();
    return (
        <div
            className="sidebar-item"
            onClick={() => {navigate(`/board-view/${name}/1`)}}
        >
            {name}
        </div>
    )
}

Category.propTypes = {
    name : PropTypes.string.isRequired,
};

function Group({name, categories}) {
    const renderedCategories = categories.map((category) =>
        <Category key={category} name={category}></Category>
    )

    return (name !== "noGroup" ?
        (<div className="sidebar-group">
            <h3>{name}</h3>
            {renderedCategories}
        </div>) :
        (<div>
            {renderedCategories}
        </div>
        )
    );
}

Group.propTypes = {
    name : PropTypes.string.isRequired,
    categories : PropTypes.array.isRequired,
};



export default function SideBar({ menuDisplay, setMenuDisplay }) {
    const location = useLocation();
    const {posts, loading, error} = useContext(PostsContext);
    useEffect(() => {
        setMenuDisplay((window.innerWidth > settings.sidebar.hideCriteria) && menuDisplay);
    }, [location])

    const wrapper = (contents)=>(
        menuDisplay ?
        <div className="side-bar">{contents}</div> :
        <></>
    );

    if (loading) return wrapper(<Loading></Loading>);
    if (error)   return wrapper(<NotFound></NotFound>);

    const categories = Object.keys(posts.__groupSetting).map(
        (key) => (
            <Group key={key} name={key} categories={posts.__groupSetting[key]}></Group>
        )
    );

    return wrapper(categories);
}

SideBar.propTypes = {
    // posts: PropTypes.object.isRequired, // isRequired로 수정
    menuDisplay : PropTypes.bool.isRequired,
    setMenuDisplay : PropTypes.func.isRequired,
};