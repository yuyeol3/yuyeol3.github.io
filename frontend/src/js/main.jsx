import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)