import '../styles/Home.css';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import { useProtectedContext } from '../context/Protected'
import { Redirect } from 'react-router-dom';


const Home = () => {
  const [tweets, setTweets] = useState([]);
  const [body, setBody] = useState({});
  let [user, setUser] = useProtectedContext();

  //mostrar tweets
  useEffect(() => {
    const desuscribir = firestore
      .collection("tweets")
      .onSnapshot(snapshot => {
        const tweets = snapshot.docs.map(doc => {
          return {
            displayName: doc.data().displayName,
            message: doc.data().message,
            email: doc.data().email,
            autor: doc.data().autor,
            uid: doc.data().uid,
            likes: doc.data().likes || 0,
            id: doc.id,
            likedBy: doc.data().likedBy,
          }
        })
        setTweets(tweets);
      });
    return () => desuscribir();
  }, []);

  const getAllTweets = () => {
    firestore
      .collection("tweets")
      //.limit(1) //limitar cuantos tweets mostrar
      //.where('likes','>',5) //mostrar solo tweets mayores de 5 likes
      //.orderBy("dateCreation",'desc') // ordenar de manera desc
      //.orderBy('likes','asc').startAt(0).endAt(1) // que muestre los de 0 a 1 likes
      .get()
      .then((snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          return {
            displayName: doc.data().displayName,
            message: doc.data().message,
            email: doc.data().email,
            autor: doc.data().autor,
            uid: doc.data().uid,
            likes: doc.data().likes || 0,
            id: doc.id,
            likedBy: doc.data().likedBy,
            dateCreation: doc.data().dateCreation,
          };
        });
        setTweets(tweets);
      });
  };

  //crear tweets
  const createTweet = (e) => {
    e.preventDefault();
    firestore
      .collection("tweets")
      .add({ ...body, uid: user.uid, displayName: user.displayName, email: user.email })
      .then(() => {
        getAllTweets()

      })
      .catch(err => console.error(err.message))
  }

  //borrar tweets
  const deleteTweet = (id) => {
    if (window.confirm("Realmente quieres borrar el mensaje?"))
      firestore.collection("tweets")
        .doc(id)
        .delete()
        .then(() => {
          getAllTweets()
        })
        .catch(err => console.error(err.message))
  }

  //da like
  const likeTweet = (id, likes, uid, likedBy) => {
    let newLikedBy = [...likedBy, uid];
    firestore.doc(`tweets/${id}`).update({ likedBy: newLikedBy });
  }

  //quita el like
  const dislikeTweet = (id, uid, likedBy) => {
    let newNewLikedBy = likedBy.filter((userUid) => uid !== userUid);
    firestore.doc(`tweets/${id}`).update({ likedBy: newNewLikedBy });
  }

  //mostrar like
  const showLike = (likersList, id, likes) => {
    if (likersList && user) {
      const youLiked = likersList.findIndex((liker) => user.uid === liker);
      //si no ha dado like
      if (youLiked < 0) {
        return (
          <>
            <span onClick={() => likeTweet(id, likes, user.uid, likersList)} className="likes">
              <img src="./image/likeoff.svg" alt="" />
              <span>{likersList.length}</span>
            </span>
          </>
        );
      } else {
        //si se dio like antes
        return (
          <>
            <span className="like_img_count" onClick={() => dislikeTweet(id, user.uid, likersList)} className="likes">
              <img className="like" src="./image/likeon.svg" alt="" />
              <span className="likeon">{likersList.length}</span>
            </span>
          </>
        );
      }
    } else {
      return (
        <>
          <span className="like_img_count" onClick={() => likeTweet(id, likes, user.id, likersList)} className="likes">
            <img className="like" src="./image/likeoff.svg" alt="" />
            <span>{likes ? likes : 0}</span>
          </span>
        </>
      );
    }
  }


  const handleChange = (e) => {
    let newTweet = {
      ...body,
      dateCreation: new Date(),//user.gettTimestamp().toDate().toString(),
      tweet: e.target.value,
      uid: user.uid,
      email: user.email,
      user: user.displayName,
      likedBy: [],
      [e.target.name]: e.target.value
    };
    setBody(newTweet)
  }

  if (!user) return <Redirect to='/' />

  return (
    <>
      <Header />
      <form className="form" onSubmit={createTweet}>
        <textarea
          autoComplete="off"
          onChange={handleChange}
          placeholder="Escribe un tweet"
          name="message"
          type="text"
        />
        <br />
        <button><img className="post"  src="./image/post.svg" alt="post" /></button>
        
      </form>

      <div className="container_principal">
        {tweets.map((tweet) => {
          return (
            <div className="container_home" key={tweet.id}>
              <div className="container_autor_trash">
                <p className="p_autor">{tweet.displayName}</p>
                <img className="trash" onClick={() => deleteTweet(tweet.id)} src="./image/trash.svg" alt="trash" />
              </div>
              <p className="p_post">{tweet.message}</p>
              {showLike(tweet.likedBy, tweet.id, tweet.likes)}
              <hr />
            </div>
          )
        })
        }
      </div>
    </>
  );
}

export default Home;