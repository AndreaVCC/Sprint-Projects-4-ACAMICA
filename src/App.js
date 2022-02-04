import {useEffect, useState} from 'react';
import {firestore} from './firebase';

const App = () => {
  //const [alarm, setAlarm] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [body, setBody] = useState({});

  const getAllTweets = () => {
    firestore
    .collection("tweets")
    //.limit(1) //limitar cuantos tweets mostrar
    //.where('likes','>',5) //mostrar solo tweets mayores de 5 likes
    //.orderBy('user','desc') // ordenar de manera desc
    //.orderBy('likes','asc').startAt(0).endAt(1) // que muestre los de 0 a 1 likes
    .get()
    .then((snapshot) => {
      const tweets = snapshot.docs.map((doc) =>{
        return {
          tweet: doc.data().message,
          autor: doc.data().user,
          id: doc.id
        };
      });
      setTweets(tweets);
  });
};

  const createTweet = (e) => {
    e.preventDefault();
    firestore.collection("tweets")
    .add(body)
    .then(()=> {
      getAllTweets()
    })
    .catch(err=> console.error(err.message))
  }

   const deleteTweet = (id) => {
    firestore.collection("tweets")
    .doc(id)
    .delete()
    .then(()=>{
      getAllTweets()
    })
    .catch(err=> console.error(err.message))

  }
 
useEffect(() => {
  getAllTweets()
}, []);


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
        //value={body.message}
        onChange={handleChange}
        placeholder="Escribe un tweet"
        name="message"
        type="text"
        />
        <br />
       <input
         placeholder="persona autora"
         //value={body.user}
         onChange={handleChange}
         name="user"
         type="text"
       />
       <button>Enviar tweet</button>
      </form>

      {tweets.map((tweet) => {
        return (   
          <div key={tweet.id}>
            <p>{tweet.tweet}</p>
            <p>Escrito por: {tweet.autor}</p>
            <button onClick={()=> deleteTweet(tweet.id)}>X</button>
            <hr/>
          </div>
        )
      })}
    </div>
  );
}

export default App;
