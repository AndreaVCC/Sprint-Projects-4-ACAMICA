//importar firebase de la libreria instalada
import firebase from 'firebase/app';
import 'firebase/firestore';
//import 'firebase/storage'; //imagenes
import 'firebase/auth';

//configuracion del proyecto
const firebaseConfig = {
  apiKey: "AIzaSyC3Sb2XDrML7irr-bfmN_pKCyVyfE-qqPs",
  authDomain: "devs-united-1c9d1.firebaseapp.com",
  projectId: "devs-united-1c9d1",
  storageBucket: "devs-united-1c9d1.appspot.com",
  messagingSenderId: "414883209871",
  appId: "1:414883209871:web:b1bcaf3bcd7b6732ea06fa"
};

// Inicializando
firebase.initializeApp(firebaseConfig);

// Export
export const firestore = firebase.firestore();
//export const storage = firebase.storage(); //imagenes
export const auth = firebase.auth();
export default firebase;
export const provider = new firebase.auth.GoogleAuthProvider();
export const loginGoogle = () => auth.signInWithPopup(provider);
export const logout = () => auth.signOut();