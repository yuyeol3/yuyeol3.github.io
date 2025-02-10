import { Link } from 'react-scroll';
import PropTypes from "prop-types";

export default function TableOfContents({post}) {
    return (
        <div className="table-of-contents">
            <nav>
                <ul>
                    {post.titleContents.map((item, idx) => {
                        console.log(item);
                        return (
                        <li
                            key={idx}
                            style={{ marginLeft: `${(item.level - 1) * 20}px`, listStyle: 'none' }}
                        >
                            <Link
                                to={item.id}
                                smooth={true}
                                duration={500}
                                containerId="App"
                                style={{ color: '#0366d6', cursor: 'pointer', textDecoration: 'none' }}
                            >
                                {item.title}
                            </Link>
                        </li>
                    )})}
                </ul>
            </nav>
        </div>
    );
}

TableOfContents.propTypes = {
    post: PropTypes.object.isRequired,
}