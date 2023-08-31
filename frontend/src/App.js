import React from 'react'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import Home from "./containers/Home";
import Signup from "./containers/Signup";
import Login from "./containers/Login";
import Activate from "./containers/Activate";
import ResetPassword from "./containers/ResetPassword";
import ResetPasswordConfirm from "./containers/ResetPasswordConfirm";
import Lobby from "./containers/Lobby";
import Layout from "./hocs/Layout";

import {Provider} from "react-redux";
import store from "./store";

const App = () => (
    <Provider store={store}>
        <Router>
            <Layout>
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/lobby' element={<Lobby/>}/>
                    <Route path='/signup' element={<Signup/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/activate/:uid/:token' element={<Activate/>}/>
                    <Route path='/reset-password' element={<ResetPassword/>}/>
                    <Route path='/password/reset/confirm/:uid/:token' element={<ResetPasswordConfirm/>}/>
                </Routes>
            </Layout>
        </Router>
    </Provider>

)

export default App;
