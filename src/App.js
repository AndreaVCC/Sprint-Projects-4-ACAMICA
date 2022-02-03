import {useEffect, useState} from 'react';
import {firestore} from './firebase';

const App = () => {

  const getAllTweets = () => {}
  const createTweet = (e) => {
    e.preventDefault();
    firestore.collection("tweets")
    .add(body)
    .then(docRef => {
      console.log("Operación exitosa")
    })
    .catch(err=> console.log("Error, algo salio mal"))
  }

  const [tweets, setTweets] = useState([]);
  const [body, setBody] = useState({});

  useEffect(() => {
    firestore.collection("tweets")
    //.limit(1) //limitar cuantos tweets mostrar
    //.where('likes','>',5) //mostrar solo tweets mayores de 5 likes
    //.orderBy('user','desc') // ordenar de manera desc
    //.orderBy('likes','asc').startAt(0).endAt(1) // que muestre los de 0 a 1 likes
    .get()
    .then(snapshot => {
      const tweets = snapshot.docs.map((doc) =>{
        return {
          tweet: doc.data().message,
          autor: doc.data().user,
          likes: doc.data().likes,
          id: doc.id
        };
      });
      setTweets(tweets);
  }, []);
  })

  const handleChange = (e) => {
    let newTweet = {
      ...body,
      [e.target.name]: e.target.value
  };
  setBody(newTweet)
}

  return (
    <div>

      <form onSubmit={createTweet}>
        <textarea
        autoComplete="off"
        value={body.message}
        onChange={handleChange}
        placeholder="Escribe un tweet"
        name="message"
        type="text"
        />
        <br />
       <input
         placeholder="persona autora"
         value={body.user}
         onChange={handleChange}
         name="user"
         type="text"
       />
       <button>Enviar tweet</button>
      </form>

      {tweets.map((tweet,i) => {
        return (   
          <div key={tweet.id}>
          <h3>TWEET {i+1}</h3>
            <h3>{tweet.tweet}<span> {tweet.likes}Likes</span></h3>
            <h4>Escrito por: {tweet.autor}</h4>
            <br/>
          </div>
        )
      })}
    </div>
  );
}

export default App;
