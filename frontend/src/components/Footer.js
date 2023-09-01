import React from "react";
import base_styles from "../styles/base.module.css"
import {connect} from "react-redux";


const Footer = ({isLoading}) => {
    if (!isLoading) {
        return (
            <div className={`${base_styles.footer} ${base_styles.entrance_anim}`}>
                <div className={base_styles.footer_icons}>
                    <a className={base_styles.footer_link} href={'https://github.com/soovuh'}>
                        <ion-icon name="logo-github"></ion-icon>
                    </a>
                    <a className={base_styles.footer_link} href={'https://www.instagram.com/soovuh/'}>
                        <ion-icon name="logo-instagram"></ion-icon>
                    </a>
                    <a className={base_styles.footer_link}
                       href={'https://www.linkedin.com/in/illia-klymenko-23696b289/'}>
                        <ion-icon name="logo-linkedin"></ion-icon>
                    </a>
                </div>
                <div className={base_styles.footer_message}>
                    <span> © 2023 All rights reserved</span>
                </div>
            </div>
        )
    } else {
        return (
            <div className={base_styles.footer}>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    isLoading: state.auth.isLoading,
})

export default connect(mapStateToProps, {})(Footer);