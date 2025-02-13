import { StrictMode } from 'react'
import {createRoot} from 'react-dom/client'
import '../css/index.css'
import App from './App.jsx'
import ConsoleWrapper from "./Controllers/consoleController.js";
import {PostsProvider} from "./Components/ContextProviders/PostsProvider.jsx";
import settings from "./settings.js";

window.console = new ConsoleWrapper(window.console, settings.main.logEnable);

const rootElement = document.getElementById('root');
createRoot(rootElement).render(
    <StrictMode>
        <PostsProvider>
            <App />
        </PostsProvider>
    </StrictMode>,
)
