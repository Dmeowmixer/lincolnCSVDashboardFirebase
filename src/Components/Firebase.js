// import firebase from './Firebase';
import app from 'firebase/app';
import auth from 'firebase/auth';
import database from 'firebase/database';
const config = {
  apiKey:process.env.REACT_APP_API_KEY,
  authDomain:process.env.REACT_APP_AUTHDOMAIN,
  databaseURL:process.env.REACT_APP_DATABASEURL,
  projectId:process.env.REACT_APP_PROJECTID,
  storageBucket:process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId:process.env.REACT_APP_MESSAGINGSENDERID,
  appId:process.env.REACT_APP_APPID
};
class Firebase {
  constructor(){
    app.initializeApp(config)
  }
}

export default Firebase;