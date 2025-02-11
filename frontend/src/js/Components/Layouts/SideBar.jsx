import {useLocation, useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import {useEffect} from "react";
import settings from "../../settings.js";

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



export default function SideBar({ posts, menuDisplay, setMenuDisplay }) {
    const location = useLocation();

    useEffect(() => {
        setMenuDisplay(window.innerWidth > settings.sidebar.hideCriteria);
    }, [location])


    const categories = posts
        ? Object.keys(posts.__groupSetting).map((key) => (
            <Group key={key} name={key} categories={posts.__groupSetting[key]}></Group>
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
    menuDisplay : PropTypes.bool.isRequired,
    setMenuDisplay : PropTypes.func.isRequired,
};