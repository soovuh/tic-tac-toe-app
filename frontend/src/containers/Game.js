import React, {useState} from "react";
import {connect} from "react-redux";
import {Navigate, useParams} from "react-router-dom";
import axios from "axios";


const Game = ({isAuthenticated, isLoading, user}) => {
    const {game_code} = useParams()

    const checkGame = () => {
        const asyncFunction = async () => {
            const body = JSON.stringify({
                game_code: game_code,
                uid: user.id
            })
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${localStorage.getItem('access')}`,
                }
            }
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/check_game/`, body, config)
            console.log(res.data)
        }
        asyncFunction()
    }

    if (!isLoading) {
        checkGame()
    }

};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    user: state.auth.user,
});

export default connect(mapStateToProps, {})(Game)