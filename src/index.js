import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import {Routes, Route, Link, useNavigate} from 'react-router-dom'

import './index.css';
import App from './App';
import Order from './layout/content/order/Order';
import Cart from './layout/content/cart/Cart';
import HistoryOrder from './layout/content/historyOrder/HistoryOrder';
import Home from './layout/content/home/Home';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
      {/* <App /> */}
      <Routes>
        <Route path="/Ql/*" element={<App />} />
        <Route path="/Home/:id" element={<Home />} />
        <Route path="/Order/:id" element={<Order />} />
        <Route path="/Cart/:id" element={<Cart />} />
        <Route path="/HistoryOrder/:id" element={<HistoryOrder />} />
      </Routes>
    </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
