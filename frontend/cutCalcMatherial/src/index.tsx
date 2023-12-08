import {BrowserRouter as Router} from 'react-router-dom';
import App from "./App.tsx";

const rootElement = document.getElementById("root");
ReactDOM.render(
    <React.StrictMode>
        <Router>
            <App/>
        </Router>,
    </React.StrictMode>,
    rootElement
);
