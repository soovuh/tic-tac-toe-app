import React, {useState, Fragment} from "react";
import base_styles from '../styles/base.module.css'
import logo from '../logo.png'
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {logout} from "../actions/auth"


const Navbar = ({logout, isAuthenticated, isLoading}) => {
    const [isShown, setIsShown] = useState(false)

    if (isAuthenticated && !isLoading) {
        return (
            <>
                <nav className={`${base_styles.navbar} ${base_styles.entrance_anim}`}>
                    <div className={base_styles.left}>
                        <div className={base_styles.logo}><Link to='/'><img className={base_styles.entrance_anim} src={logo} alt=""/></Link></div>
                        <div className={base_styles.link_wrapper}>
                            <ul className={base_styles["nav-links"]}>
                                <li><Link className={base_styles["nav-link"]} to='/'>Home</Link></li>
                                <li><Link className={base_styles["nav-link"]} to='/toplist'>TopList</Link></li>
                                <li><Link className={base_styles["nav-link"]} to='/about'>About</Link></li>
                                <li><Link className={base_styles["nav-link"]} to='/profile'>Profile</Link></li>
                                <li><Link className={base_styles["nav-link"]} to="/login"
                                          onClick={logout}>Logout</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={base_styles.right}>
                        <Link className={base_styles["play-button"]} to="/lobby">Play</Link>
                    </div>
                    <div className={base_styles.burger}>
                <span onClick={() => setIsShown(!isShown)}>
                    <ion-icon name="reorder-three-outline"></ion-icon>
                </span>
                    </div>
                </nav>
                {
                    isShown && <nav className={`${base_styles["burger-nav"]} ${base_styles.entrance_anim}`} style={{color: "#fff"}}>
                        <Link onClick={() => setIsShown(false)} className={base_styles["nav-link"]} to="/">Home</Link>
                        <Link onClick={() => setIsShown(false)} className={base_styles["nav-link"]}
                              to='/toplist'>TopList</Link>
                        <Link onClick={() => setIsShown(false)} className={base_styles["nav-link"]} to='/about'>About</Link>

                        <Link onClick={() => setIsShown(false)} className={base_styles["nav-link"]}
                              to='/profile'>Profile</Link>
                        <Link onClick={() => {
                            setIsShown(false)
                            logout()
                        }} className={base_styles["nav-link"]} to="/login">Logout</Link>
                        <Link onClick={() => setIsShown(false)} className={base_styles["play-button"]}
                              to="/lobby">Play</Link>

                    </nav>
                }
            </>
        )
    } else if (!isAuthenticated && !isLoading) {
        return (
            <>
                <nav className={`${base_styles.navbar} ${base_styles.entrance_anim}`}>
                    <div className={base_styles.left}>
                        <div className={base_styles.logo}><Link to='/'><img src={logo} alt=""/></Link></div>
                        <div className={base_styles.link_wrapper}>
                            <ul className={base_styles["nav-links"]}>
                                <li><Link className={base_styles["nav-link"]} to='/'>Home</Link></li>
                                <li><Link className={base_styles["nav-link"]} to='/toplist'>TopList</Link></li>
                                <li><Link className={base_styles["nav-link"]} to='/about'>About</Link></li>
                                <li><Link className={base_styles["nav-link"]} to='/login'>Log In</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className={base_styles.right}>
                        <Link className={base_styles["play-button"]} to="/login">Play</Link>
                    </div>
                    <div className={base_styles.burger}>
                <span onClick={() => setIsShown(!isShown)}>
                    <ion-icon name="reorder-three-outline"></ion-icon>
                </span>
                    </div>
                </nav>
                {
                    isShown && <nav className={`${base_styles["burger-nav"]} ${base_styles.entrance_anim}`} style={{color: "#fff"}}>
                        <Link onClick={() => setIsShown(false)} className={base_styles["nav-link"]} to="/">Home</Link>
                        <Link onClick={() => setIsShown(false)} className={base_styles["nav-link"]}
                              to='/toplist'>TopList</Link>
                        <Link onClick={() => setIsShown(false)} className={base_styles["nav-link"]} to='/about'>About</Link>
                        <Link onClick={() => setIsShown(false)} className={base_styles["nav-link"]} to='/login'>Log
                            In</Link>
                        <Link onClick={() => setIsShown(false)} className={base_styles["play-button"]}
                              to="/login">Play</Link>
                    </nav>
                }
            </>
        )
    } else {
        return (
            <nav className={base_styles.navbar}>
            </nav>
        )
    }


}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
})

export default connect(mapStateToProps, {logout})(Navbar);