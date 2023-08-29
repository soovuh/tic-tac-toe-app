import React, {useState} from "react";
import {Navigate, useParams} from 'react-router-dom'
import {connect} from "react-redux";
import {verify} from "../actions/auth";
import base_styles from "../styles/base.module.css"
import styles from "../styles/login.module.css"

const Activate = ({verify}) => {
    const [verified, setVerified] = useState(false)
    const {uid, token} = useParams();
    const verifyAccount = e => {
        verify(uid, token);
        setVerified(true)

    }
    if (verified) {
        return <Navigate to={'/'}/>;
    }

    return (
        <div className={base_styles.wrapper}>
            <div className={styles.signin_wrapper}>
                <h1>Verify your account</h1>
                <button onClick={verifyAccount}>Verify</button>
            </div>
        </div>
    )
}



export default connect(null, {verify})(Activate);