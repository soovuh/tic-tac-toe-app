import React, {useEffect} from "react";
import Navbar from '../components/Navbar'
import Footer from "../components/Footer";
import styles from "../styles/base.module.css"
import {connect} from "react-redux";
import {checkAuthenticated, load_user} from "../actions/auth";

const Layout = (props) => {
    useEffect((props) => {
        props.checkAuthenticated();
        props.load_user();
    }, []);

    return (
        <div className={styles.app}>
            <Navbar/>
            {props.children}
            <Footer/>
        </div>
    )
}

export default connect(null, {checkAuthenticated, load_user})(Layout);