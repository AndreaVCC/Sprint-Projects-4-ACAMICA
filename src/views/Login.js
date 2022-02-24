import '../styles/Login.css';
import React, { useState, useEffect } from "react";
import { auth, loginGoogle } from '../firebase';
import { useProtectedContext } from '../context/Protected';
import { Redirect } from 'react-router-dom';


const Login = () => {
    let [user, setUser] = useProtectedContext();

    const login = (e) => {
        e.preventDefault();
        loginGoogle() // sin destrusturing 
            .then((userCredential) => {
                let { uid, email, displayName } = userCredential.user;
                setUser({ uid, email, displayName });
            })
            .catch((err) => console.error(err))
    }

    if (user) return <Redirect to='/home' />

    return (
        <>
            <div className="container">
                <div className="container_logo">
                    <img className="logo_login" src="./image/logobig.svg" alt="Logo"/>
                </div>
                <div className="container_login">
                <h1>LA RED SOCIAL PARA DEVS</h1>
                <p>La tecnología es mejor cuando junta a las personas</p>
                <img className="google_sign" src="./image/googlesignin.svg" onClick={login} alt=""/>
                <p className="p_purple">© 2020 Devs_United - <span className="p_pink">BETA</span></p>
                </div>

            </div>


        </>
    )
};

export default Login;