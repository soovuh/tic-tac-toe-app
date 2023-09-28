import {connect} from "react-redux";
import base_styles from "../styles/base.module.css";
import LoadingSpinner from "../components/LoadingSpinner";
import logo from '../logo.png'
import styles from '../styles/about.module.css'

const About = ({isLoading}) => {
    return (
        <div className={base_styles.wrapper}>
            <div className={styles.about_wrapper}>

                <img className={styles.about_img} src={logo} alt=""/>
                <p className={styles.about_p}> Online Tic-Tac-Toe Game is a project that allows users to play the classic Tic-Tac-Toe game online.
                    Players can register, confirm their e-mail address and engage in real-time bouts with opponents. The
                    project
                    includes features such as user authentication, time-limited play, password reset, and a leaderboard
                    with
                    ordering capabilities. The project uses a technology stack consisting of Django Rest Framework for
                    backend,
                    React for frontend and Redis for WebSocket functions.</p>
            </div>
        </div>
    )
};

const mapStateToProps = (state) => ({
    isLoading: state.auth.isLoading,
});

export default connect(mapStateToProps, {})(About);
