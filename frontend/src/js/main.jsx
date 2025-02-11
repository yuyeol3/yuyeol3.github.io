import { StrictMode } from 'react'
import {createRoot, hydrateRoot} from 'react-dom/client'
// import { render, hydrate } from 'react-dom';
import '../css/index.css'
import App from './App.jsx'
import {getPosts} from "./Services/getPosts.js";


window.loadingStates = []
// posts 데이터는 전역 객체가 되는 게 맞는 것 같다.
function setPostsData() {
    getPosts()
        .then(data=>{
            window.posts = data;
            console.log(data);
            for (const state of window.loadingStates) {
                state(false, data);
            }
        })
        .catch(err=>{
            console.log(err);
        })

}

setPostsData();
setInterval(()=>setPostsData(),
    60 * 1000 // 5분마다 갱신
);

const rootElement = document.getElementById('root');



if (rootElement.hasChildNodes()) {
    hydrateRoot(rootElement, <App/>)
} else {
    createRoot(rootElement).render(
        <StrictMode>
            <App />
        </StrictMode>,
    )
}