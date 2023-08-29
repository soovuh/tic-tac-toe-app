import React, {useState} from "react";
import {Navigate, useParams} from 'react-router-dom'
import {connect} from "react-redux";
import {reset_password_confirm} from "../actions/auth";

import base_styles from "../styles/base.module.css"
import styles from "../styles/login.module.css"

const ResetPasswordConfirm = ({reset_password_confirm}) => {
    const [error, setError] = useState('');
    const [requestSent, setRequestSent] = useState(false);
    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: ''
    });

    const {new_password, re_new_password} = formData;

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value});
    const {uid, token} = useParams();

    const onSubmit = async e => {
        e.preventDefault();
        if (new_password === re_new_password) {
            try {
                await reset_password_confirm(uid, token, new_password, re_new_password);
                setRequestSent(true);
            } catch (err) {
                if (err.response && err.response.status === 400) {
                    setError('An error occurred. Please try again later');
                } else {
                    setError('An error occurred. Please try again later.');
                }
            }
        } else {
            setError('Passwords must match!')
        }
    };

    if (requestSent) {
        return <Navigate to='/'/>
    }

    return (
        <div className={base_styles.wrapper}>
            <div className={styles.signin_wrapper}>
                <h1>Reset password</h1>
                <form onSubmit={e => onSubmit(e)}>
                    <div>
                        <input
                            type="password"
                            placeholder='New Password'
                            name='new_password'
                            value={new_password}
                            onChange={e => onChange(e)}
                            minLength='6'
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder='Repeat New Password'
                            name='re_new_password'
                            value={re_new_password}
                            onChange={e => onChange(e)}
                            minLength='6'
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

export default connect(null, {reset_password_confirm})(ResetPasswordConfirm);