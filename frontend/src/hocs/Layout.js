import React from "react";
import Navbar from '../components/Navbar'
import Footer from "../components/Footer";
import styles from "../styles/base.module.css"

const Layout = (props) => (
    <div className={styles.app}>
        <Navbar />
        {props.children}
        <Footer />
    </div>
)

export default Layout;