import { StrictMode } from 'react'
import {createRoot, hydrateRoot} from 'react-dom/client'
import {getPosts} from "./Services/getPosts.js";
import settings from "./settings.js";

import '../css/index.css'
import App from './App.jsx'

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
    settings.main.updateMin * 60 * 1000
);

const rootElement = document.getElementById('root');

createRoot(rootElement).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
