import { useEffect, useState } from 'react';
import { firestore } from './firebase';
import './App.css';
// import heart from '../public/heart.svg';

const App = () => {
  //const [alarm, setAlarm] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [body, setBody] = useState({});
  const [hasUpdate, setUpdate] = useState(false);

  //mostrar tweets
  const getAllTweets = () => {
    firestore
      .collection("tweets")
      //.limit(1) //limitar cuantos tweets mostrar
      //.where('likes','>',5) //mostrar solo tweets mayores de 5 likes
      //.orderBy('user','desc') // ordenar de manera desc
      //.orderBy('likes','asc').startAt(0).endAt(1) // que muestre los de 0 a 1 likes
      .get()
      .then((snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          return {
            tweet: doc.data().message,
            autor: doc.data().user,
            likes: doc.data().likes || 0,
            id: doc.id
          };
        });
        setTweets(tweets);
      });
  };

  //crear tweets
  const createTweet = (e) => {
    e.preventDefault();
    firestore.collection("tweets")
      .add(body)
      .then(() => {
        getAllTweets()
      })
      .catch(err => console.error(err.message))
  }

  //borrar tweets
  const deleteTweet = (id) => {
    firestore.collection("tweets")
      .doc(id)
      .delete()
      .then(() => {
        getAllTweets()
      })
      .catch(err => console.error(err.message))
  }

  //actualizar likes tweets
  const likeTweet = (tweet) => {
    firestore.doc(`tweets/${tweet.id}`)
      .update({ likes: tweet.likes + 1 })
      .then(() => {
        //getAllTweets()
      })
      .catch(err => console.error(err.message))
  }

  useEffect(() => {
    //getAllTweets()
    const desuscribir = firestore.collection("tweets").onSnapshot(snapshot => {
      const tweets = snapshot.docs.map(doc => {
        return {
          tweet: doc.data().message,
          autor: doc.data().user,
          likes: doc.data().likes || 0,
          id: doc.id
        }
      })
      setTweets(tweets);
    });
    return () => desuscribir();
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
          placeholder="Autor"
          //value={body.user}
          onChange={handleChange}
          name="user"
          type="text"
        />
        <button>Enviar</button>
      </form>

      {tweets.map((tweet) => {
        return (
          <div className="app" key={tweet.id}>
            <p>Tweet: {tweet.tweet}</p>
            <p>Autor: {tweet.autor}</p>
            <button onClick={() => setUpdate(!hasUpdate)}>Editar</button>
            <button onClick={() => deleteTweet(tweet.id)}>Borrar</button>
            <div>
              <button onClick={() => likeTweet(tweet)}>Me gusta</button>
              <span>Likes: {tweet.likes}</span>
            </div>
            <hr />
          </div>
        )
      })}
    </div>
  );
}

export default App;
