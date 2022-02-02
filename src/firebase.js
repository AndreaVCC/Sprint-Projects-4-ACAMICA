//importar firebase de la libreria instalada
import firebase from 'firebase/app';
import 'firebase/firestore';

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
export const firestore = firebase.firestore();
export default firebase;