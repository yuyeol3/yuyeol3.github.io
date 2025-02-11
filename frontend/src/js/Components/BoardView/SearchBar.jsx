import PropTypes from "prop-types";
import {useEffect, useState} from "react";

export default function SearchBar({searchRange, setTargetBoard, setPSize}) {
    const [searchText, setSearchText] = useState("");


    function handleSubmit(event) {
        event.preventDefault();
        console.log(searchRange);
        const res = searchRange.filter((target)=>
                target.title
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) || false
            )

        console.log("res", res);
        setTargetBoard(res);
        setPSize(res.length);
        setSearchText("");
    }

    return (
        <div className="search-bar">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="search-bar-input"
                    placeholder="Search"
                    value={searchText}
                    onChange={(e)=>setSearchText(e.target.value)}
                />
                <button>검색</button>
            </form>
        </div>
    )
}

SearchBar.propTypes = {
    searchRange : PropTypes.array.isRequired,
    setTargetBoard: PropTypes.func.isRequired,
    setPSize : PropTypes.func.isRequired
}