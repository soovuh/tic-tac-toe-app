import React, {useState} from "react";
import {connect} from "react-redux";
import {Link, Navigate, useNavigate} from "react-router-dom";
import base_styles from "../styles/base.module.css";
import styles from "../styles/login.module.css";
import LoadingSpinner from "../components/LoadingSpinner";

const Game = ({isAuthenticated, isLoading, user}) => {

    return <div>Game</div>
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    user: state.auth.user,
});

export default connect(mapStateToProps, {})(Game)