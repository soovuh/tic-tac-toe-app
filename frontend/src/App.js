import React from 'react'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import Home from "./containers/Home";
import Signup from "./containers/Signup";
import Login from "./containers/Login";
import Activate from "./containers/Activate";
import ResetPassword from "./containers/ResetPassword";
import ResetPasswordConfirm from "./containers/ResetPasswordConfirm";
import Layout from "./hocs/Layout";

const App = () => (
    <Router>
        <Layout>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/activate/:uid/:token' element={<Activate/>}/>
                <Route path='/reset-password' element={<ResetPassword/>}/>
                <Route path='/password/reset/confirm/:uid/:token' element={<ResetPasswordConfirm/>}/>
            </Routes>
        </Layout>
    </Router>
)

export default App;
