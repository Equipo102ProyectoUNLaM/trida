const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
admin.initializeApp();

/* healthcheck endpoint */
exports.ping = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
  response.send("pong");
  });
 });

 /* create user creates a user into firebase auth service */
/*exports.createUser = functions.https.onRequest( (data, context) => {
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
        .then((userRecord) => {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log('Successfully created new user:', userRecord.uid);
          return userRecord
        })
        .catch((error) => {
          console.log('Error creating new user:', error);
          return error
        });
})

/* register sets the user record to firestore */
/*exports.register = functions.auth.user().onCreate((data)=> {
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
})*/

let transporter = nodemailer.createTransport({
  service: 'gmail',
  //port: 465,
  auth: {
      user: 'trida.app@gmail.com',
      pass: 'tr1d@@pp'
  }
});

exports.sendMail = functions.https.onRequest((req, res) => {
  //cors(req, response, () => {
    
      // getting dest email by query string
      const dest = req.query.dest;
      console.log(dest);
      const mailOptions = {
          from: 'Trida App <trida.app@gmail.com>',
          to: dest,
          subject: 'Te invitaron a Trida!',
          html: `<p style="font-size: 16px;">En instantes recibirás un mail para establecer tu contraseña. <br />
          Luego, podés loguearte con este mail y tu contraseña en trida.com.ar</p>
              <br />
          `
      };

      // returning result
    return transporter.sendMail(mailOptions);
 // });    
});
