const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase)

/* healthcheck endpoint */
exports.ping = functions.https.onRequest((request, response) => {
  response.send("pong");
 });

 /* create user creates a user into firebase auth service */
exports.createUser = functions.https.onRequest( (data, context) => {
   console.log('Name', data.name);
    return admin.auth().createUser({
        email: data.mail,
        emailVerified: false,
        phoneNumber: '+11234567890',
        password: data.pass,
        displayName: data.name,
        photoURL: 'http://www.example.com/12345678/photo.png',
        disabled: false
      })
        .then(function(userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log('Successfully created new user:', userRecord.uid);
          return userRecord
        })
        .catch(function(error) {
          console.log('Error creating new user:', error);
          return error
        });
})

/* register sets the user record to firestore */
exports.register = functions.auth.user().onCreate((data)=> {
    const user = {
        id: data.uid,
        name: data.displayName,
        email: data.email,
        date_created: data.metadata.creationTime
    }

    return admin.firestore().collection('users')
    .doc(data.uid)
    .set(user)
    .then(doc => console.log('user added', doc))
})
