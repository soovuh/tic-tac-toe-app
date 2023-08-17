import React from "react";
import base_styles from '../styles/base.module.css'
import logo from '../logo.png'

const Navbar = () => (
    <nav className={base_styles.navbar}>
        <div className={base_styles.left}>
            <div className={base_styles.logo}><img src={logo} alt=""/></div>
            <div className={base_styles.link_wrapper}>
                <ul className={base_styles["nav-links"]}>
                    <li><a className={base_styles["nav-link"]} href="#">Home</a></li>
                    <li><a className={base_styles["nav-link"]} href="#">Toplist</a></li>
                    <li><a className={base_styles["nav-link"]} href="#">About</a></li>
                    <li><a className={base_styles["nav-link"]} href="#">Log In</a></li>
                </ul>
            </div>
        </div>
        <div className={base_styles.right}>
            <a href="#">Play</a>
        </div>

    </nav>
)

export default Navbar;