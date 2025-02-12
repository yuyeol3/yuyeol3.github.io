import { StrictMode } from 'react'
import {createRoot} from 'react-dom/client'
import '../css/index.css'
import App from './App.jsx'
import {PostsProvider} from "./Components/ContextProviders/PostsProvider.jsx";

const rootElement = document.getElementById('root');
createRoot(rootElement).render(
    <StrictMode>
        <PostsProvider>
            <App />
        </PostsProvider>
    </StrictMode>,
)
