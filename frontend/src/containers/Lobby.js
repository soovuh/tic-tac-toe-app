import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

const Lobby = ({ isAuthenticated }) => {
    useEffect(() => {
        const socket = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}/ws/lobby/`);

        socket.onopen = async () => {
            console.log("WebSocket connection opened");
            const data = JSON.stringify({
                action: "searching"
            })
            await socket.send(data);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.event === "match_found") {
                console.log('Match found with opponent:', data.opponent);
                // Navigate to the game page or take other actions
            }
        };

        return () => {
            socket.close();
        };
    }, []);

    if (!isAuthenticated) {
        return <Navigate to='/' />;
    }

    return (
        <div>
            <div>
                Searching for opponents...
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {})(Lobby);
