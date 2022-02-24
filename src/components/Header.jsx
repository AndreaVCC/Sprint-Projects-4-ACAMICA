import '../styles/Header.css';
import React, { useState, useEffect } from "react";
import { firestore, logout } from '../firebase';
import { useProtectedContext } from '../context/Protected'




const Header = () => {

    let [user, setUser] = useProtectedContext();

    const logoutt = () => {
        setUser(null);
        logout()
    }

    return (
        <>
            <div className="container_header">
                <div className="container_header_logos">
                    <img className="logosmall" src="./image/logosmall.svg" alt="Logo" />

                    <img className="devs_united" src="./image/Devs_United.svg" alt="Logo" />
                </div>

                <div className="container_logout">
                    <img onClick={logoutt} className="logout" src="./image/logout.svg" alt="Logout" />

                </div>



            </div>


        </>
    )
};

export default Header;