import {useEffect} from 'react';
import {firestore} from './firebase';

const App = () => {

  useEffect(() => {
    firestore.collection("tweets")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.data());
      });
  }, []);


  })
  return (
    <div>
      Devs united
    </div>
  );
}

export default App;
