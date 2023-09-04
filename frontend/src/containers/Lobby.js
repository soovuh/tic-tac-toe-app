import React, {useState} from "react";
import {connect} from "react-redux";
import {Link, Navigate, useNavigate} from "react-router-dom";
import base_styles from "../styles/base.module.css";
import styles from "../styles/login.module.css";
import LoadingSpinner from "../components/LoadingSpinner";

const Lobby = ({isAuthenticated, isLoading, user}) => {
    const navigate = useNavigate();
    const [isSearching, setIsSearching] = useState(false);
    const [opponent, setOpponent] = useState(null);
    const [socket, setSocket] = useState(null);

    // Function, that open new socket
    const startSearch = () => {
        // Firstly, we check, if user exists and socket not already started
        if (user && !socket) {
            const newSocket = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}/ws/search/`);

            newSocket.onopen = async () => {
                console.log("Connection opened");

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

                console.log('Match found:', data.opponent);
                setIsSearching(false);
                setOpponent(data.opponent);
                // newSocket.close();

            };
            newSocket.onclose = () => {
                console.log("connection closed");
                setSocket(null);
                setIsSearching(false);
                setOpponent(null);

            };
        }
    };


    const stopSearch = async () => {
        if (socket) {
            const data = JSON.stringify({
                action: 'close',
                user_id: user.id
            })
            console.log("send")
            await socket.send(data);
        }
    };

    window.addEventListener('beforeunload', stopSearch)


    if (isSearching) {
        return (
            <div className={base_styles.wrapper}>
                <div className={styles.signin_wrapper}>
                    <h1>Searching for opponents...</h1>
                    <LoadingSpinner/>
                    <button onClick={stopSearch}>Stop Search</button>
                    <p>
                        Already have an account? <Link to='/login'>Sign In</Link>
                    </p>
                </div>
            </div>
        );
    }

    if (opponent) {
        return <div>Your opponent is {opponent.name}</div>;
    }
    if (!isAuthenticated && !isLoading) {
        return <Navigate to='/login'/>;
    } else if (isAuthenticated && !isLoading) {
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