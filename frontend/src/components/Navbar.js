import React, {useState} from "react";
import base_styles from '../styles/base.module.css'
import logo from '../logo.png'

const Navbar = () => {
    const [isShown, setIsShown] = useState(false)


    return (
        <nav className={base_styles.navbar}>
            <div className={base_styles.left}>
                <div className={base_styles.logo}><img src={logo} alt=""/></div>
                <div className={base_styles.link_wrapper}>
                    <ul className={base_styles["nav-links"]}>
                        <li><a className={base_styles["nav-link"]} href="#">Home</a></li>
                        <li><a className={base_styles["nav-link"]} href="#">TopList</a></li>
                        <li><a className={base_styles["nav-link"]} href="#">About</a></li>
                        <li><a className={base_styles["nav-link"]} href="#">Log In</a></li>
                    </ul>
                </div>
            </div>
            {isShown && <nav className={base_styles["burger-nav"]} style={{color: "#fff"}}>
                <a className={base_styles["nav-link"]} href="#">Home</a>
                <a className={base_styles["nav-link"]} href="#">TopList</a>
                <a className={base_styles["nav-link"]} href="#">About</a>
                <a className={base_styles["nav-link"]} href="#">Log In</a>
                <a className={base_styles["play-button"]} href="#">Play</a>
            </nav>}
            <div className={base_styles.right}>
                <a className={base_styles["play-button"]} href="#">Play</a>
            </div>
            <div className={base_styles.burger}>
                <span onClick={() => setIsShown(!isShown)}>
                    <ion-icon name="reorder-three-outline"></ion-icon>
                </span>

            </div>

        </nav>
    )
}

export default Navbar;