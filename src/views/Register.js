import React, { useState, useEffect } from "react";
import  { auth, firestore } from '../firebase';
import { useProtectedContext } from '../context/Protected';


const Register = () => {

    const [body, setBody] = useState({});
    let [user, setUser] = useProtectedContext();

    const register = (e) => {
        e.preventDefault();
        auth
        .createUserWithEmailAndPassword(body.email, body.password) // sin destrusturing 
        .then((userCredential) => {
            let {uid,email} = userCredential.user;
            firestore
            .collection('users')
            .add({email,uid})
            .then(()=> console.log('Se creo el usuario'))
            .catch((err)=> console.error(err.message));
        })
        .catch((err) => console.error(err))
    }


const handleInput = (e) => {
    setBody({ ...body, [e.target.name]: e.target.value })
}

return (
    <form onSubmit={register}>
        <input onChange={handleInput} type='text' name='name' placeholder='name' />
        <input onChange={handleInput} type='email' name='email' placeholder='email' />
        <input onChange={handleInput} type='text' name='password' placeholder='password' />
        <input type='submit' value='Crear usuario' />
    </form>
);
};

export default Register;