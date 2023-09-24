import React from 'react'
import {unstable_HistoryRouter as Router, Route, Routes} from "react-router-dom";
import history from "./myHistory";

import Home from "./containers/Home";
import Signup from "./containers/Signup";
import Login from "./containers/Login";
import Activate from "./containers/Activate";
import ResetPassword from "./containers/ResetPassword";
import ResetPasswordConfirm from "./containers/ResetPasswordConfirm";
import Lobby from "./containers/Lobby";
import Game from "./containers/Game";
import Layout from "./hocs/Layout";

import {Provider} from "react-redux";
import store from "./store";
import TopList from "./containers/TopList";

const App = () => (
    <Provider store={store}>
        <Router history={history}>
            <Layout>
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/lobby' element={<Lobby/>}/>
                    <Route path='/signup' element={<Signup/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/toplist' element={<TopList/>}/>
                    <Route path='/activate/:uid/:token' element={<Activate/>}/>
                    <Route path='/reset-password' element={<ResetPassword/>}/>
                    <Route path='/password/reset/confirm/:uid/:token' element={<ResetPasswordConfirm/>}/>
                    <Route path='/game/:game_code/:uid' element={<Game/>}/>
                </Routes>
            </Layout>
        </Router>
    </Provider>

)

export default App;
