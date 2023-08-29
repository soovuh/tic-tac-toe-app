import React, {useState} from "react";
import {Link, Navigate} from 'react-router-dom'
import {connect} from "react-redux";
import {signup} from "../actions/auth";
import base_styles from "../styles/base.module.css"
import styles from "../styles/login.module.css"

const Signup = ({signup, isAuthenticated}) => {
    const [error, setError] = useState('');
    const [accountCreated, setAccountCreated] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        re_password: '',
    })
    const {name, email, password, re_password} = formData;
    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})
    const onSubmit = async e => {
        e.preventDefault();
        if (password === re_password) {
            try {
                await signup(name, email, password, re_password);
                setAccountCreated(true)

            } catch (err) {
                if (err.response && err.response.status === 400) {
                    setError('Email is not valid or already in use. Try another one.');
                } else {
                    setError('An error occurred. Please try again later.');
                }
            }

        } else {
            setError('Passwords must match!')
        }

    }

    if (isAuthenticated) {
        return <Navigate to='/profile'/>
    }
    if (accountCreated) {
        return <Navigate to={'/login/'}/>
    }

    return (
        <div className={base_styles.wrapper}>
            <div className={styles.signin_wrapper}>
                <h1>Sign Up</h1>
                <form onSubmit={e => onSubmit(e)}>
                    <div>
                        <input
                            type="text"
                            placeholder='Name*'
                            name='name'
                            value={name}
                            onChange={e => onChange(e)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder='Email*'
                            name='email'
                            value={email}
                            onChange={e => onChange(e)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder='Password*'
                            name='password'
                            value={password}
                            onChange={e => onChange(e)}
                            minLength='6'
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder='Repeat Password'
                            name='re_password'
                            value={re_password}
                            onChange={e => onChange(e)}
                            minLength='6'
                            required
                        />
                    </div>
                    {error && <p className={base_styles.error_message}>{error}</p>}
                    <button type='submit'>Register</button>
                </form>
                <p>
                    Already have an account? <Link to='/login'>Sign In</Link>
                </p>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {signup})(Signup);