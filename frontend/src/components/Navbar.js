import React, {useState} from "react";
import base_styles from '../styles/base.module.css'
import logo from '../logo.png'
import {Link} from "react-router-dom";

const Navbar = () => {
    const [isShown, setIsShown] = useState(false)


    return (
        <>
            <nav className={base_styles.navbar}>
                <div className={base_styles.left}>
                    <div className={base_styles.logo}><img src={logo} alt=""/></div>
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
                isShown && <nav className={base_styles["burger-nav"]} style={{color: "#fff"}}>
                    <Link className={base_styles["nav-link"]} to="/">Home</Link>
                    <Link className={base_styles["nav-link"]} to='/toplist'>TopList</Link>
                    <Link className={base_styles["nav-link"]} to='/about'>About</Link>
                    <Link className={base_styles["nav-link"]} to='/login'>Log In</Link>
                    <Link className={base_styles["play-button"]} to='/login'>Play</Link>
                </nav>
            }
        </>
    )
}

export default Navbar;