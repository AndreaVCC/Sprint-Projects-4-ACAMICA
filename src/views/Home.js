import { useEffect, useState } from 'react';
import { firestore, logout } from '../firebase';
//import './App.css';
// import heart from '../public/heart.svg';
import { useProtectedContext } from '../context/Protected'
import { Redirect } from 'react-router-dom';


const Home = () => {

    //const [alarm, setAlarm] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [body, setBody] = useState({});
    const [hasUpdate, setUpdate] = useState(false);

    let [user, setUser] = useProtectedContext();

    const logoutt = () => {
        logout()
        setUser(null);
          }
         

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
                        message: doc.data().message,
                        displayName: doc.data().displayName,
                        user: doc.data().user,
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
        firestore
            .collection("tweets")
            .add({ ...body, uid: user.uid, displayName: user.displayName})
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

    //likes tweets
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
        const unsubscribe = firestore
            .collection("tweets")
            .onSnapshot(snapshot => {
                const tweets = snapshot.docs.map(doc => {
                    return {
                        displayName: doc.data().displayName,
                        message: doc.data().message,
                        user: doc.data().user,
                        likes: doc.data().likes || 0,
                        id: doc.id
                    }
                })
                setTweets(tweets);
                });
        return () => unsubscribe();
    }, []);

    const handleChange = (e) => {
        let newTweet = {
            ...body,
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
                                <button onClick={() => likeTweet(tweet)}>Me gusta</button>
                                <span>Likes: {tweet.likes}</span>
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