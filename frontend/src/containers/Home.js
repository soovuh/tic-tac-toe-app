import React from "react";
import base_styles from '../styles/base.module.css'
import styles from '../styles/home.module.css'
import {Link} from "react-router-dom";
import {connect} from "react-redux";


const Home = ({isAuthenticated}) => {
    if (isAuthenticated) {
        return (
            <div className={base_styles.wrapper}>
                <div className={styles.greetings_wrapper}>
                    <h1 className={styles.header}>Welcome back!</h1>
                    <p className={styles.intro}>You're back to the online Tic-Tac-Toe game!</p>
                    <p className={styles.click_info}>Click the play button to start a new game</p>
                    <Link className={styles.play_btn} to='/lobby'>Play Now</Link>
                </div>
            </div>

        )
    }
    return (
        <div className={base_styles.wrapper}>
            <div className={styles.greetings_wrapper}>
                <h1 className={styles.header}>Welcome to Tic-Tac-Toe online!</h1>
                <p className={styles.intro}>This is online version of tic-tac-toe game</p>
                <p className={styles.click_info}>Click the login button for start</p>
                <Link className={styles.login_btn} to='/login'>Log In</Link>
            </div>
        </div>
    )

}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, {})(Home);