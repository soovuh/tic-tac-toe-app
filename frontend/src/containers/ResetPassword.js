import React, {useState} from "react";
import {Navigate, useNavigate} from 'react-router-dom'
import {connect} from "react-redux";
import {reset_password} from "../actions/auth";
import base_styles from "../styles/base.module.css"
import styles from "../styles/login.module.css"
import LoadingSpinner from "../components/LoadingSpinner";

const ResetPassword = ({reset_password, isAuthenticated, isLoading}) => {
    const [loading, setLoading] = useState(false);
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
            setLoading(true);
            setError("");
            await reset_password(email);
            setRequestSent(true);
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setError('Email is not valid or not in use. Try another one.');
            } else {
                setError('An error occurred. Please try again later.');
            }
        } finally {
            setLoading(false)
        }

    }
    const navigate = useNavigate()
    const changePage = (e) => {
        navigate("/")
    }

    if (requestSent) {
        return (
            <div className={base_styles.wrapper}>
                <div className={styles.signin_wrapper}>
                    <h1>Check your email!</h1>
                    <form onSubmit={() => changePage()}>
                        <button type={"submit"}>Ok</button>
                    </form>
                </div>
            </div>
        )
    }
    if (isAuthenticated && !isLoading) {
        return <Navigate to={"/"}/>
    } else if (!isAuthenticated && !isLoading) {
        return (
            <div className={`${base_styles.wrapper} ${base_styles.entrance_anim}`}>
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
                        {loading ? (
                            <LoadingSpinner/>
                        ) : (
                            <button type='submit'>Reset Password</button>
                        )}
                    </form>
                </div>
            </div>
        )
    } else {
        return (
            <div className={base_styles.wrapper}>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading
})


export default connect(mapStateToProps, {reset_password})(ResetPassword);