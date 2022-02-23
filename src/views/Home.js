import { useEffect, useState } from 'react';
import { firestore, logout } from '../firebase';
//import './App.css';
// import heart from '../public/heart.svg';
import { useProtectedContext } from '../context/Protected'
import { Redirect } from 'react-router-dom';
//import like from "../public/redheart.svg";
//import dislike from "../public/whiteheart.svg";


const Home = () => {

    //const [alarm, setAlarm] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [body, setBody] = useState({});
    //const [hasUpdate, setUpdate] = useState(false);

    let [user, setUser] = useProtectedContext();

    const logoutt = () => {
        setUser(null);
        logout()
    }
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
                    console.log(doc.data())

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
            .add({ ...body, uid: user.uid, displayName: user.displayName, email:user.email})
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

    /*
    //likes tweets
    const likeTweet = (tweet) => {
        firestore.doc(`tweets/${tweet.id}`)
            .update({ likes: tweet.likes + 1 })
            .then(() => {
                getAllTweets()
            })
            .catch(err => console.error(err.message))
    }
*/


  
 //// LIKES /////
 //da like al tweet
 const likeTweet = (id, likes, uid, likedBy) => {
    let newLikedBy = [...likedBy, uid];
    firestore.doc(`tweets/${id}`).update({ likedBy: newLikedBy });
  }

  //quita el like al tweet
  const dislikeTweet = (id, uid, likedBy) => {
    let newNewLikedBy = likedBy.filter((userUid) => uid !== userUid);
    firestore.doc(`tweets/${id}`).update({ likedBy: newNewLikedBy });
  }

   //mostrar like
   const showLike = (likersList, id, likes) => {
    if (likersList && user) {
      const youLiked = likersList.findIndex((liker) => user.uid === liker);
      //si la persona no le ha dado like
      if (youLiked < 0) {
        return (
          <>
            <span onClick={() => likeTweet(id, likes, user.uid, likersList)} className="likes">
              <img src="./image/likeoff.svg" alt=""/>
              <span>{likersList.length}</span>
            </span>
          </>
        );
      } else {
        //si la persona le dio like
        return (
          <>
            <span onClick={() => dislikeTweet(id, user.uid, likersList)} className="likes">
              <img  className="like" src="./image/likeon.svg" alt=""/>
              <span className="likeon">{likersList.length}</span>
            </span>
          </>
        );
      }
    } else {
      return (
        <>
          <span onClick={() => likeTweet(id, likes, user.id, likersList)} className="likes">
            <img className="like" src="./image/likeoff.svg" alt=""/>
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

    // if (!user) {
    //    return <p>Not logged in</p>
    //  }

    if (!user) return <Redirect to='/' />

    return (
        <>
            <div>
                <button onClick={logoutt}>
                    cerrar
                </button>
                {tweets.map((tweet) => {
                    console.log(tweet)
                    return (
                        <div className="app" key={tweet.id}>
                            <p>Tweet: {tweet.message}</p>
                            <p>Autor: {tweet.displayName}</p>
                            <button onClick={() => deleteTweet(tweet.id)}>Borrar</button>
                            <div>
                            {showLike(tweet.likedBy, tweet.id, tweet.likes)}                            
                            </div>
                            <hr />
                        </div>
                    )
                })
                }
            </div>

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

                <button>Enviar</button>
            </form>
        </>
    );
}

export default Home;