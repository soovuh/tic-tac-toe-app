import React, {useState} from "react";
import {connect} from "react-redux";
import {Link, Navigate, useNavigate} from "react-router-dom";
import base_styles from "../styles/base.module.css";
import styles from "../styles/login.module.css";

const Lobby = ({isAuthenticated, user}) => {
    const navigate = useNavigate();
    const [isSearching, setIsSearching] = useState(false);
    const [opponent, setOpponent] = useState(null);
    const [socket, setSocket] = useState(null);

    const startSearch = () => {
        if (user && !socket) {
            const newSocket = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}/ws/lobby/`);
            newSocket.onopen = async () => {
                console.log("WebSocket connection opened");
                setIsSearching(true);
                const data = JSON.stringify({
                    action: "searching",
                    user_id: user.id,
                });
                await newSocket.send(data);
            };
            newSocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.event === "match_found") {
                    console.log('Match found with opponent:', data.opponent);
                    setIsSearching(false);
                    setOpponent(data.opponent);
                } else if (data.event === "waiting") {
                    setIsSearching(true);
                    setOpponent(null);
                }
            };
            newSocket.onclose = () => {
                console.log("WebSocket connection closed");
                setSocket(null);
                setIsSearching(false);
                setOpponent(null);
            };
            setSocket(newSocket);
        }
    };

    const stopSearch = () => {
        if (socket) {
            socket.close();
        }
    };

    if (!isAuthenticated) {
        return <Navigate to='/login'/>;
    }

    if (isSearching) {
        return (
            <div className={base_styles.wrapper}>
                <div className={styles.signin_wrapper}>
                    <h1>Searching for opponents...</h1>
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

    return (
        <div className={base_styles.wrapper}>
            <div className={styles.signin_wrapper}>
                <h1>Start searching</h1>
                <button onClick={startSearch}>Start Search</button>
                <p>
                    Wanna play with friend? <Link to='/lobby-friend'>Click here</Link>
                </p>
            </div>
        </div>
)
    ;
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
});

export default connect(mapStateToProps, {})(Lobby)