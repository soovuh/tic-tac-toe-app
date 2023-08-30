import React, {useState} from "react";
import {Navigate, useParams} from 'react-router-dom'
import {connect} from "react-redux";
import {verify} from "../actions/auth";
import LoadingSpinner from "../components/LoadingSpinner";
import base_styles from "../styles/base.module.css"
import styles from "../styles/login.module.css"

const Activate = ({verify}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [verified, setVerified] = useState(false)
    const {uid, token} = useParams();
    const verifyAccount = async e => {

        try {
            setLoading(true)
            await verify(uid, token);
            setVerified(true);
        } catch (err) {
            if (err.response && err.response.status === 403) {
                setError("This activation link is no longer valid.");
            } else {
                setError("An error occurred. Please try again later");
            }
        } finally {
            setLoading(false)
        }
    }
    if (verified) {
        return <Navigate to={'/'}/>;
    }

    return (
        <div className={base_styles.wrapper}>
            <div className={styles.signin_wrapper}>
                <h1>Verify your account</h1>
                {error && <p className={base_styles.error_message}>{error}</p>}
                {loading ? (
                    <LoadingSpinner/>
                ) : (
                    <button onClick={verifyAccount}>Verify</button>
                )}
            </div>
        </div>
    )
}


export default connect(null, {verify})(Activate);