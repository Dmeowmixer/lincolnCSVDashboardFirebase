import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyD7FEEwruKRs10N83Ns3zd2bwNKAqQrRuo",
  authDomain: "lincolnstore-9d2b7.firebaseapp.com",
  databaseURL: "https://lincolnstore-9d2b7.firebaseio.com",
  projectId: "lincolnstore-9d2b7",
  storageBucket: "lincolnstore-9d2b7.appspot.com",
  messagingSenderId: "1012247268498",
  appId: "1:1012247268498:web:9d2719fae3992ce3"
};
firebase.initializeApp(config);

export default firebase;