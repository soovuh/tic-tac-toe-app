import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Navigate, useNavigate} from "react-router-dom";

const Lobby = ({isAuthenticated, user}) => {
    const navigate = useNavigate()
    useEffect(() => {
        const socket = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}/ws/lobby/`);

        socket.onopen = async () => {
            console.log("WebSocket connection opened");
            if (user) {
                const data = JSON.stringify({
                    action: "searching",
                    user_id: user.id,
                })
                await socket.send(data);
            } else {
                await socket.close()
                navigate("/login");
            }
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
        return <Navigate to='/login' />;
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
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
});

export default connect(mapStateToProps, {})(Lobby);
