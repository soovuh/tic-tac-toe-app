import React, {useState} from "react";
import {Navigate} from 'react-router-dom'
import {connect} from "react-redux";
import {reset_password} from "../actions/auth";
import base_styles from "../styles/base.module.css"
import styles from "../styles/login.module.css"

const ResetPassword = ({reset_password}) => {
    const [error, setError] = useState('');
    const [requestSent, setRequestSent] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
    })
    const {email} = formData;
    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})
    const onSubmit = async e => {
        e.preventDefault();
        try {
            await reset_password(email);
            setRequestSent(true);
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setError('Email is not valid or not in use. Try another one.');
            } else {
                setError('An error occurred. Please try again later.');
            }
        }

    }

    if (requestSent) {
        return <Navigate to='/'/>
    }

    return (
        <div className={base_styles.wrapper}>
            <div className={styles.signin_wrapper}>
                <h1>Enter your email</h1>
                <form onSubmit={e => onSubmit(e)}>
                    <div>
                        <input
                            type="email"
                            placeholder='Email'
                            name='email'
                            value={email}
                            onChange={e => onChange(e)}
                            required
                        />
                    </div>
                    {error && <p className={base_styles.error_message}>{error}</p>}
                    <button type='submit'>Reset Password</button>
                </form>
            </div>
        </div>
    )
}

export default connect(null, {reset_password})(ResetPassword);