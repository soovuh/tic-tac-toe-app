import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import axios from "axios";

const Game = ({isAuthenticated, isLoading, user}) => {
    const {game_code, uid} = useParams();
    const [data, setData] = useState(null);
    const [player, setPlayer] = useState(null);
    const [socket, setSocket] = useState(null);
    const [turn, setTurn] = useState(null);
    const [game, setGame] = useState(null);
    const navigate = useNavigate()
    const checkGame = async () => {
        try {
            const body = JSON.stringify({
                game_code: game_code,
                uid: uid,
            });

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${localStorage.getItem('access')}`,
                },
            };
            try {
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/check_game/`, body, config);
                setData(res.data);
                setPlayer(res.data.player)
            } catch (e){
                navigate('/')
            }

        } catch (error) {
            console.error("Error checking the game:", error);
        }
    };

    useEffect(() => {
        if (!isLoading && isAuthenticated && !data) {
            checkGame();
        }
    }, [isLoading, isAuthenticated, data]);

    useEffect(() => {
        if (!socket && player && game === null) {
            const newSocket = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}/ws/game/${game_code}/`);

            newSocket.onopen = async () => {
                console.log("Connection opened");

                setGame(true);
                setSocket(newSocket)


                const data = JSON.stringify({
                    action: 'start',
                    player: player,
                    uid: uid,
                    game_code: game_code,
                });

                await newSocket.send(data);
            };

            newSocket.onmessage = async (event) => {
                const data = JSON.parse(event.data);
                if (data.action === 'start') {
                    console.log(data);
                }
            };

            newSocket.onclose = () => {
                console.log("connection closed");
                setSocket(null);
            };
        }
    }, [socket, player, game, uid, game_code]);


    if (player === "n" || !isAuthenticated) {
        if (!isLoading)
            return <Navigate to='/'/>
    }


    return (
        <div>
            {/* Your component JSX */}
        </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    user: state.auth.user,
});

export default connect(mapStateToProps, {})(Game);
