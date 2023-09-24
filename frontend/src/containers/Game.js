import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Link, Navigate, useLocation, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import base_styles from "../styles/base.module.css";
import game_styles from '../styles/game.module.css'
import checkForWin from "../actions/winCheck";
import LoadingSpinner from "../components/LoadingSpinner";
import drawCheck from "../actions/drawCheck";
import styles from "../styles/login.module.css";

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
    const [yourTurn, setTurn] = useState(false)
    const [enemySurr, setEnemySurr] = useState(false)

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

    const handleBeforeUnload = () => {
        if (socket) {
            socket.sendSurr();
            socket.close();
        }
    };


    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [socket]);

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
            let enemy
            newSocket.onopen = async () => {
                setSocket(newSocket)
                if (localStorage.getItem('isPlay') === 'true') {
                    await newSocket.sendSurr();
                } else {
                    localStorage.setItem('isPlay', 'true')
                    const data = JSON.stringify({
                        action: 'start',
                        player: player,
                        uid: uid,
                        game_code: game_code,
                    });

                    await newSocket.send(data);
                }

            };


            newSocket.onmessage = async (event) => {
                const data = JSON.parse(event.data);
                if (data.action === 'start') {

                    setGame(true);
                    if (player === 'x') {
                        turn = true
                        enemy = 'o'
                        setTurn(true)

                    }
                    if (player === 'o') {
                        enemy = 'x'
                        turn = false
                        setTurn(false)
                    }
                } else if (data.action === 'turn') {
                    if (!cellsArr[data.cell]) {
                        setCellsArr((prevState) => {
                            const newState = prevState
                            newState[data.cell] = data.player
                            const isDraw = drawCheck(newState)
                            const isWin = checkForWin(cellsArr, player)
                            const isEnemyWin = checkForWin(cellsArr, enemy)
                            if (isEnemyWin) {
                                return newState
                            }
                            if (isWin) {
                                setIsWin(true)
                                return newState
                            }
                            if (isDraw) {
                                setIsDraw(true)
                                return  newState
                            }
                            return newState
                        })
                        setCell(data.player)
                        turn = !turn;
                        setTurn(turn)
                    }
                } else if (data.action === 'win') {
                    localStorage.removeItem('isPlay')
                    turn = false
                    if (data.player === player) {
                        gameEnd(true)
                    } else if (data.player !== player) {
                        gameEnd(false)
                    }
                    await newSocket.close()

                } else if (data.action === 'draw') {
                    localStorage.removeItem('isPlay')
                    turn = false
                    gameDraw()
                    await newSocket.close()
                } else if (data.action === 'surr') {
                    localStorage.removeItem('isPlay')
                    turn = false
                    if (data.player === player) {
                        gameEnd(false)
                    } else if (data.player !== player) {
                        gameEnd(true, true)
                    }
                    await newSocket.close()
                }
            };

            newSocket.onclose = () => {
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
                localStorage.removeItem('isPlay')
                const data = JSON.stringify({
                    action: 'win',
                    player: player,
                    uid: uid,
                })

                await newSocket.send(data)
            }

            newSocket.sendDraw = async () => {
                localStorage.removeItem('isPlay')
                const data = JSON.stringify({
                    action: 'draw'
                })
                await newSocket.send(data)
            }
            newSocket.sendSurr = async () => {
                localStorage.removeItem('isPlay')
                const data = JSON.stringify({
                    action: 'surr',
                    player: player,
                    uid: uid
                })
                await newSocket.send(data)
            }

        }
    }, [socket, player, game, uid, game_code]);

    const gameEnd = (win, surr=false) => {
        setEnemySurr(surr)
        setIsEnd(true)
        setIsWin(win)
        setGame(false)
    }

    const gameDraw = () => {
        setIsEnd(true)
        setIsDraw(true)
        setGame(false)
    }

    if (isEnd) {
        if (isDraw) {
            return (
                <div className={styles.signin_wrapper}>
                    <h1>Draw!</h1>
                    <button onClick={() => navigate('/lobby')}>Ok</button>
                </div>
            )
        } else {
            return (
                <div>
                    {isWin &&
                        <div className={styles.signin_wrapper}>
                            <h1>You win!</h1>
                            {enemySurr && <p className={game_styles.surr}>The enemy surrendered!</p>}
                            <button onClick={() => navigate('/lobby')}>Ok</button>
                        </div>
                    }
                    {!isWin &&
                        <div className={styles.signin_wrapper}>
                            <h1>You lose!</h1>
                            <button onClick={() => navigate('/lobby')}>Ok</button>
                        </div>
                    }
                </div>
            )
        }

    }


    if (player === "n" || !isAuthenticated) {
        if (!isLoading)
            return <Navigate to='/'/>
    } else if (!isLoading && player && socket && game) {
        return (
            <div className={base_styles.wrapper}>
                <div className={game_styles.game_container}>
                    <div className={game_styles.turn} style={{color: yourTurn ? '#fff' : '#d20606'}}>
                        {yourTurn && "Your turn"}
                        {!yourTurn && 'Enemy turn'}
                    </div>
                    <div className={game_styles['tic-tac-toe']}>
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
                    <div className={game_styles.players}>
                        {`You're playing as ${player}`}
                    </div>
                    <div className={game_styles.note}>
                        Note: If you refresh, close or leave the game page, you will be scored a loss!
                    </div>
                </div>

            </div>
        )
    } else {
        return (
            <div className={base_styles.wrapper}>
                <LoadingSpinner/>
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
