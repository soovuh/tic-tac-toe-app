import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Navigate, useParams} from "react-router-dom";
import axios from "axios";

const Game = ({isAuthenticated, isLoading, user}) => {
        const {game_code} = useParams()
        const [player, setPlayer] = useState(null)
        const [socket, setSocket] = useState(null)
        const gameCheck = async () => {
            if (localStorage.getItem('access')) {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `JWT ${localStorage.getItem('access')}`,
                        'Accept': 'application/json'
                    }
                };
                const uid = user.id
                const body = JSON.stringify({game_code, uid});
                try {
                    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/game/check_game/`, body, config)
                    setPlayer(res.data.player)
                } catch (err) {
                    setPlayer("n")
                }
            }
        }

        const startSocket = () => {
            if (!socket) {
                const newSocket = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}/ws/game/`);

                newSocket.onopen = async () => {
                    console.log("Connection opened");
                    setSocket(newSocket);

                    const data = JSON.stringify({
                        action: "connect",
                        game_code: game_code,
                        uid: user.id,
                        player: player
                    });

                    await newSocket.send(data);
                };
                newSocket.onmessage = async (event) => {
                    const data = JSON.parse(event.data);
                    console.log(data)
                };
                newSocket.onclose = () => {
                    console.log("connection closed");
                    setSocket(null);
                };
            }
        }
        const stopSocket = async () => {
            if (socket) {
                const data = JSON.stringify({
                    action: 'close',
                    user_id: user.id
                })
                console.log("send")
                await socket.send(data);
            }
        };

        if (!isLoading && !player) {
            gameCheck()
        }
        if (player === "o" || player === "x") {
            if (!socket) {
                startSocket()
            }

        }
        if (player === "n") {
            return <Navigate to="/"/>
        }


        return (
            <div>
                <h1>This player is {player} - Player</h1>
            </div>
        )
    }
;

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    user: state.auth.user,
});

export default connect(mapStateToProps, {})(Game)