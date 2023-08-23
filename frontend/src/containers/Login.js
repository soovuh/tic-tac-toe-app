import React, {useState} from "react";
import {Link, Navigate} from 'react-router-dom'
import {connect} from "react-redux";
import {login} from "../actions/auth";
import base_styles from "../styles/base.module.css"
import styles from "../styles/login.module.css"

const Login = ({login, isAuthenticated}) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const {email, password} = formData;
    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})
    const onSubmit = e => {
        e.preventDefault();
        login(email, password)
    }

    if (isAuthenticated) {
        return <Navigate to='/profile' />
    }

    return (
        <div className={base_styles.wrapper}>
            <div className={styles.signin_wrapper}>
                <h1>Sign in</h1>
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
                    <div>
                        <input
                            type="password"
                            placeholder='Password'
                            name='password'
                            value={password}
                            onChange={e => onChange(e)}
                            minLength='6'
                            required
                        />
                    </div>
                    <button type='submit'>Login</button>
                </form>
                <p>
                    Don`t have an account? <Link to='/signup'>Sign up</Link>
                </p>
                <p className='mt=3'>
                    Forgot your password? <Link to='/reset-password'>Reset Password</Link>
                </p>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {login})(Login);