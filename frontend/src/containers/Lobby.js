import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Link, Navigate} from "react-router-dom";
import base_styles from "../styles/base.module.css";
import styles from "../styles/login.module.css";
import LoadingSpinner from "../components/LoadingSpinner";

const Lobby = ({isAuthenticated, isLoading, user}) => {
    const [isSearching, setIsSearching] = useState(false);
    const [code, setCode] = useState(null);
    const [socket, setSocket] = useState(null);
    const [isPlay, setIsPlay] = useState(localStorage.getItem('isPlay') === 'true');

    const startSearch = () => {
        if (user && !socket) {
            const newSocket = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}/ws/search/`);

            newSocket.onopen = async () => {

                setIsSearching(true);
                setSocket(newSocket);

                const data = JSON.stringify({
                    action: "search",
                    user_id: user.id,
                });

                await newSocket.send(data);
            };
            newSocket.onmessage = async (event) => {
                const data = JSON.parse(event.data);
                setCode(data.code)
                setIsSearching(false);


            };
            newSocket.onclose = () => {

                setSocket(null);
                setIsSearching(false);
            };
        }
    };


    const stopSearch = async () => {
        if (socket) {
            const data = JSON.stringify({
                action: 'close',
                user_id: user.id
            })
            await socket.send(data);
        }
    };
    useEffect(() => {
        window.addEventListener("beforeunload", stopSearch);

        return () => {
            window.removeEventListener("beforeunload", stopSearch);
        };
    }, [socket]);


    useEffect(() => {
        const checkLocalStorage = () => {
            const storedIsPlay = localStorage.getItem('isPlay');
            if (storedIsPlay === null) {
                setIsPlay(false)
                clearInterval(interval);
            }
        };

        const timeOut = () => {
            localStorage.removeItem('isPlay')
            setIsPlay(false)
            clearTimeout(timeout)
        };
        const interval = setInterval(checkLocalStorage, 1000);
        const timeout = setTimeout(timeOut, 30000);

        checkLocalStorage();

        return () => {
            clearInterval(interval);
            clearTimeout(timeout)
        };
    }, []);


    if (isSearching) {
        return (
            <div className={base_styles.wrapper}>
                <div className={styles.signin_wrapper}>
                    <h1>Searching for opponents...</h1>
                    <LoadingSpinner/>
                    <button onClick={stopSearch}>Stop Search</button>
                </div>
            </div>
        );
    }

    if (code) {
        return <Navigate to={`/game/${code}/${user.id}`}/>
    }
    if (isPlay && isAuthenticated && !isLoading) {
        return (
            <div className={base_styles.wrapper}>
                <div className={styles.signin_wrapper}>
                    <h2>You have left the previous game. To get the right to search for a new game, wait up to 30
                        seconds without reloading the page...</h2>
                    <LoadingSpinner/>
                </div>
            </div>
        )
    } else if (!isAuthenticated && !isLoading) {
        return <Navigate to='/login'/>;
    } else if (isAuthenticated && !isLoading && !isPlay) {
        return (
            <div className={`${base_styles.wrapper} ${base_styles.entrance_anim}`}>
                <div className={styles.signin_wrapper}>
                    <h1>Start searching</h1>
                    <button onClick={startSearch}>Start Search</button>
                    <p>
                        Wanna play with friend? <Link to='/lobby-friend'>Click here</Link>
                    </p>
                </div>
            </div>
        )
    } else {
        return <div className={base_styles.wrapper}></div>
    }

};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    user: state.auth.user,
});

export default connect(mapStateToProps, {})(Lobby)