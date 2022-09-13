import React from "react";
// import { render } from "react-dom";
import {createRoot} from "react-dom/client";
import OpenLayerMap from "./js/OpenLayerMap";
import 'bootstrap/dist/css/bootstrap.min.css';
import MainNavBar from "./js/MainNavBar";
const App = () => (
    <div>
        <MainNavBar/>
        <OpenLayerMap/>
    </div>
);
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<App/>)
