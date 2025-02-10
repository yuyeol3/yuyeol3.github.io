import {Element} from "react-scroll";
import React from "react";
import PropTypes from "prop-types";

export default function HeadingRenderer ({ level, children }) {
    // 예시: 만약 markdown 파서에서 headerIndex를 알 수 없다면,
    // 혹은 별도의 id 생성 로직을 사용한다면 아래와 같이 처리
    // console.log(level, children);
    const headerText = children.toString();
    // 실제로는 파서에서 headerIndex를 받아 id로 "header-{headerIndex}"를 부여해야 함
    // const id = headerText.replace(/\s+/g, '-').toLowerCase();
    const id = headerText.replace(/\s+/g, '-');
    console.log(id);
    return (
        <Element id={id} name={id}>
            {React.createElement(`h${level}`, null, children)}
        </Element>
    )
};

HeadingRenderer.propTypes = {
    level: PropTypes.number.isRequired,
    children: PropTypes.node.isRequired
}
