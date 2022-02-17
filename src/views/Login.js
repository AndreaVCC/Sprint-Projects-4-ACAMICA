import React, { useState, useEffect } from "react";
import { auth, loginGoogle } from '../firebase';
import { useProtectedContext } from '../context/Protected';
import { Redirect } from 'react-router-dom';

const Login = () => {

    //const [body, setBody] = useState({});
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
    //console.log(user)



    // const handleInput = (e) => {
    //     setBody({ ...body, [e.target.name]: e.target.value })
    // }

    
    /* useEffect(() => {
         auth.onAuthStateChanged((user) => {
             let { uid, email, displayName } = user;
             setUser({ uid, email, displayName});
         });
     }, []);
     */

    if (user) return <Redirect to='/home' />

    return (
        <>
           
                <button onClick={login}>
                    Iniciar con Google
                </button>
           
        </>
    )
};

export default Login;