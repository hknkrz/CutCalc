import React from 'react';

import {BrowserRouter, Route, Routes} from "react-router-dom";
import Navbar from "./components/NavBar.tsx";
import Library from "./pages/Library";
import Home from "./pages/Home.tsx";


const App = () => {
    return (
        <div>
            <Navbar/>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/library" element={<Library/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
