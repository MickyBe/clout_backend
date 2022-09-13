import firebase from 'firebase-admin';
var serviceAccount = require('./kliq-3b5af-firebase-adminsdk-slv49-54a9e35eb7.json');

export default firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});
