import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

const Lobby = ({ isAuthenticated, user }) => {
    const navigate = useNavigate();
    const [isSearching, setIsSearching] = useState(false);
    const [opponent, setOpponent] = useState(null);

    useEffect(() => {
        const socket = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}/ws/lobby/`);

        socket.onopen = async () => {
            console.log("WebSocket connection opened");
            if (user) {
                setIsSearching(true);
                const data = JSON.stringify({
                    action: "searching",
                    user_id: user.id,
                });
                await socket.send(data);
            } else {
                await socket.close();
                navigate("/login");
            }
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.event === "match_found") {
                console.log('Match found with opponent:', data.opponent);
                setIsSearching(false);
                setOpponent(data.opponent);
                // navigate(`/game/${data.opponent.id}`);
            } else if (data.event === "waiting") {
                setIsSearching(true);
                setOpponent(null);
            }
        };

        return () => {
            socket.close();
        };
    }, [user]);

    if (!isAuthenticated) {
        return <Navigate to='/login' />;
    }

    if (isSearching) {
        return <div>Searching for opponents...</div>;
    }

    if (opponent) {
        return <div>Your opponent is {opponent.name}</div>
    }

    return <div>Idle...</div>;
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
});

export default connect(mapStateToProps, {})(Lobby);

