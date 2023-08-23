import React, {useState, Fragment} from "react";
import base_styles from '../styles/base.module.css'
import logo from '../logo.png'
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {logout} from "../actions/auth"

const Navbar = ({logout, isAuthenticated}) => {
    const [isShown, setIsShown] = useState(false)

    return (
        <>
            <nav className={base_styles.navbar}>
                <div className={base_styles.left}>
                    <div className={base_styles.logo}><Link to='/'><img src={logo} alt=""/></Link></div>
                    <div className={base_styles.link_wrapper}>
                        <ul className={base_styles["nav-links"]}>
                            <li><Link className={base_styles["nav-link"]} to='/'>Home</Link></li>
                            <li><Link className={base_styles["nav-link"]} to='/toplist'>TopList</Link></li>
                            <li><Link className={base_styles["nav-link"]} to='/about'>About</Link></li>
                            {!isAuthenticated &&
                                <li><Link className={base_styles["nav-link"]} to='/login'>Log In</Link></li>}
                            {isAuthenticated &&
                                <li><Link className={base_styles["nav-link"]} to='/profile'>Profile</Link></li>}
                            {isAuthenticated &&
                                <li><Link className={base_styles["nav-link"]} to="/login" onClick={logout}>Logout</Link>
                                </li>}
                        </ul>
                    </div>
                </div>
                <div className={base_styles.right}>
                    {!isAuthenticated && <Link className={base_styles["play-button"]} to="/login">Play</Link>}
                    {isAuthenticated && <Link className={base_styles["play-button"]} to="/lobby">Play</Link>}
                </div>
                <div className={base_styles.burger}>
                <span onClick={() => setIsShown(!isShown)}>
                    <ion-icon name="reorder-three-outline"></ion-icon>
                </span>
                </div>
            </nav>
            {
                isShown && <nav className={base_styles["burger-nav"]} style={{color: "#fff"}}>
                    <Link className={base_styles["nav-link"]} to="/">Home</Link>
                    <Link className={base_styles["nav-link"]} to='/toplist'>TopList</Link>
                    <Link className={base_styles["nav-link"]} to='/about'>About</Link>
                    {!isAuthenticated &&
                        <Link className={base_styles["nav-link"]} to='/login'>Log In</Link>}
                    {isAuthenticated &&
                        <Link className={base_styles["nav-link"]} to='/profile'>Profile</Link>}
                    {!isAuthenticated && <Link className={base_styles["play-button"]} to="/login">Play</Link>}
                    {isAuthenticated && <Link className={base_styles["play-button"]} to="/lobby">Play</Link>}
                </nav>
            }
        </>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {logout})(Navbar);