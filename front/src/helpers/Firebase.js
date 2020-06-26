import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions'

import {firebaseConfig} from '../constants/defaultValues'

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();
const functions = firebase.functions();

export {
   auth,
   database,
   functions
};
