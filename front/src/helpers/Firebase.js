import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';
import 'firebase/firestore';
import 'firebase/storage';

import { firebaseConfig } from '../constants/defaultValues';

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();
const functions = firebase.functions();
const firestore = firebase.firestore();
const storage = firebase.storage();
const timeStamp = firebase.firestore.Timestamp;

export { auth, database, functions, firestore, storage, timeStamp };
