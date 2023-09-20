import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import base_styles from "../styles/base.module.css";
import game_styles from '../styles/game.module.css'
import checkForWin from "../actions/winCheck";
import LoadingSpinner from "../components/LoadingSpinner";
import drawCheck from "../actions/drawCheck";

const Game = ({isAuthenticated, isLoading, user}) => {
    const {game_code, uid} = useParams();
    const [data, setData] = useState(null);
    const [player, setPlayer] = useState(null);
    const [socket, setSocket] = useState(null);
    const [game, setGame] = useState(null);
    const [cellsArr, setCellsArr] = useState(['', '', '', '', '', '', '', '', ''])
    const [cell, setCell] = useState('')
    const [isWin, setIsWin] = useState(null)
    const [isEnd, setIsEnd] = useState(false)
    const [isDraw, setIsDraw] = useState(false)
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
            } catch (e) {
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
        if (isWin && socket) {
            const asyncFunc = async () => {
                await socket.sendWin()
            }
            asyncFunc()
        }

    })

    useEffect(() => {
        if (isDraw && socket) {
            const asyncFunc = async () => {
                await socket.sendDraw()
            }
            asyncFunc()
        }
    })

    useEffect(() => {
        let turn = false
        if (!socket && player && game === null) {

            const newSocket = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}/ws/game/${game_code}/`);

            newSocket.onopen = async () => {
                console.log("Connection opened");

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
                    if (localStorage.getItem(game_code)) {
                        setCellsArr(JSON.parse(localStorage.getItem(game_code)))
                    }
                    setGame(true);
                    if (player === 'x') {
                        turn = true

                    }
                    if (player === 'o') {
                        turn = false

                    }
                } else if (data.action === 'turn') {
                    if (!cellsArr[data.cell]) {
                        setCellsArr((prevState) => {
                            const newState = prevState
                            newState[data.cell] = data.player
                            localStorage.setItem(game_code, JSON.stringify(newState))
                            const isDraw = drawCheck(newState)
                            if (isDraw) {
                                setIsDraw(true)
                            }
                            const isWin = checkForWin(cellsArr, player)
                            if (isWin) {
                                setIsWin(true)
                            }
                            return newState
                        })

                        setCell(data.player)
                        turn = !turn;
                    }
                } else if (data.action === 'win') {
                    turn = false
                    if (data.player === player) {
                        gameEnd(true)
                    } else if (data.player !== player) {
                        gameEnd(false)
                    }

                } else if (data.action === 'draw') {
                    turn = false
                    gameDraw()
                }
            };

            newSocket.onclose = () => {
                console.log("connection closed");
                setSocket(null);
            };
            newSocket.doTurn = async (event) => {
                if (turn) {
                    const clickedCellId = event.target.id;

                    const data = JSON.stringify({
                        action: 'turn',
                        player: player,
                        cell: clickedCellId
                    });
                    await newSocket.send(data)
                }
            }

            newSocket.sendWin = async () => {
                const data = JSON.stringify({
                    action: 'win',
                    player: player,
                    uid: uid,
                })
                await newSocket.send(data)
            }

            newSocket.sendDraw = async () => {
                const data = JSON.stringify({
                    action: 'draw'
                })
                await newSocket.send(data)
            }

        }
    }, [socket, player, game, uid, game_code]);

    const gameEnd = (win) => {
        setIsEnd(true)
        setIsWin(win)
        localStorage.removeItem(game_code)
    }

    const gameDraw = () => {
        setIsEnd(true)
        setIsDraw(true)
        localStorage.removeItem(game_code)
    }

    if (isEnd) {
        if (isDraw) {
            return <div>Draw!</div>
        } else {
            return (
                <div>
                    {isWin && 'You win!'}
                    {!isWin && 'You lose!'}
                </div>
            )
        }

    }

    if (isLoading) {
        return (
            <div className={base_styles.wrapper}>
                <LoadingSpinner/>
            </div>
        )
    } else if (player === "n" || !isAuthenticated) {
        if (!isLoading)
            return <Navigate to='/'/>
    } else if (!isLoading && player && socket && game) {
        return (
            <div className={base_styles.wrapper}>
                <div>
                    {isEnd}
                    <div className={game_styles.row} id={cell}>
                        <div id='0' onClick={socket.doTurn} className={game_styles.cell}>{cellsArr[0]}</div>
                        <div id='1' onClick={socket.doTurn} className={game_styles.cell}>{cellsArr[1]}</div>
                        <div id='2' onClick={socket.doTurn} className={game_styles.cell}>{cellsArr[2]}</div>
                    </div>
                    <div className={game_styles.row}>
                        <div id='3' onClick={socket.doTurn} className={game_styles.cell}>{cellsArr[3]}</div>
                        <div id='4' onClick={socket.doTurn} className={game_styles.cell}>{cellsArr[4]}</div>
                        <div id='5' onClick={socket.doTurn} className={game_styles.cell}>{cellsArr[5]}</div>
                    </div>
                    <div className={game_styles.row}>
                        <div id='6' onClick={socket.doTurn} className={game_styles.cell}>{cellsArr[6]}</div>
                        <div id='7' onClick={socket.doTurn} className={game_styles.cell}>{cellsArr[7]}</div>
                        <div id='8' onClick={socket.doTurn} className={game_styles.cell}>{cellsArr[8]}</div>
                    </div>
                </div>
            </div>
        )
    }
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    user: state.auth.user,
});

export default connect(mapStateToProps, {})(Game);
