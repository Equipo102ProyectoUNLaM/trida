import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/messaging';

import { firebaseConfig } from '../constants/defaultValues';

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();
const functions = firebase.functions();
const firestore = firebase.firestore();
const storage = firebase.storage();
const timeStamp = firebase.firestore.Timestamp;
// const messaging = firebase.messaging();

// Add the public key generated from the console here.
// messaging.usePublicVapidKey(
//   'BMafKMN5ZDJ0jZcgmwT-wJWx4U_EvRHxbQB5OwMrN9Y-FbXUD45q8EkiT7LZBfG12DQ1bJDnlcCkqrPPZFCrEWY'
// );

// export const preguntarPermisos = async () => {
//   try {
//     await Notification.requestPermission().then(async (permission) => {
//       if (permission === 'denied') {
//         console.log("Permission wasn't granted. Allow a retry.");
//         return;
//       } else if (permission === 'default') {
//         console.log('The permission request was dismissed.');
//         return;
//       }
//       const token = await messaging.getToken();
//       console.log('user token: ', token);

//       return token;
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

export { auth, database, functions, firestore, storage, timeStamp };
