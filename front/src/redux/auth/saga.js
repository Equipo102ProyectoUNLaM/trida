import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { auth, firestore, functions } from 'helpers/Firebase';
import { addDocumentWithId } from 'helpers/Firebase-db';
import {
  LOGIN_USER,
  REGISTER_USER,
  LOGOUT_USER,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
} from '../actions';

import {
  loginUserSuccess,
  loginUserError,
  registerUserSuccess,
  registerUserError,
  forgotPasswordSuccess,
  forgotPasswordError,
  resetPasswordSuccess,
  resetPasswordError,
} from './actions';
import { addDocument } from 'helpers/Firebase-db';
import { changeLocale } from 'redux/settings/actions';

export function* watchLoginUser() {
  yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

const loginWithEmailPasswordAsync = async (email, password) =>
  await auth
    .signInWithEmailAndPassword(email, password)
    .then((authUser) => authUser)
    .catch((error) => error);

function* loginWithEmailPassword({ payload }) {
  const { email, password } = payload.user;
  const { history } = payload;

  try {
    const loginUser = yield call(loginWithEmailPasswordAsync, email, password);
    if (!loginUser.message) {
      localStorage.setItem('user_id', loginUser.user.uid);
      yield put(loginUserSuccess(loginUser.user));
      history.push('/');
    } else {
      yield put(loginUserError(loginUser.message));
    }
  } catch (error) {
    yield put(loginUserError(error));
  }
}

export function* watchRegisterUser() {
  yield takeEvery(REGISTER_USER, registerWithEmailPassword);
}

const registerWithEmailPasswordAsync = async (email, password) =>
  await auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => authUser)
    .catch((error) => error);

const addRegisteredUserToDB = async (registerUser, email, isInvited) => {
  const userObj = {
    id: registerUser.user.uid,
    mail: email,
    nombre: '',
    apellido: '',
    telefono: '',
    foto: '',
    primerLogin: true,
    cambiarPassword: false,
    instituciones: [],
    rol: 1,
  };
  try {
    await addDocumentWithId('usuarios', registerUser.user.uid, userObj);
  } catch (error) {
    put(registerUserError(error));
  }
};

export const sendInvitationEmail = async (email) => {
  const req = { query: { dest: email } };
  const sendMail = functions.httpsCallable('ping'); //send email function
  console.log(sendMail);
  sendMail(req)
    .then(function (result) {
      // Read result of the Cloud Function.
      var sanitizedMessage = result.data.text;
    })
    .catch(function (error) {
      // Getting the Error details.
      var code = error.code;
      var message = error.message;
      var details = error.details;
    });
};

function* registerWithEmailPassword({ payload }) {
  const { email, password, isInvited } = payload.user;
  const { history } = payload;
  try {
    const registerUser = yield call(
      registerWithEmailPasswordAsync,
      email,
      password
    );
    if (!registerUser.message) {
      // ver acá, tiene que esperar
      yield call(addRegisteredUserToDB, registerUser, email, isInvited);
      if (!isInvited) {
        history.push('/');
        localStorage.setItem('user_id', registerUser.user.uid);
      } else {
        const userObj = { payload: { forgotUserMail: { email: email } } };
        yield call(forgotPassword, userObj);
        yield call(sendInvitationEmail, email);
      }
      yield put(registerUserSuccess(registerUser));
    } else {
      yield put(registerUserError(registerUser.message));
    }
  } catch (error) {
    yield put(registerUserError(error));
  }
}

export function* watchLogoutUser() {
  yield takeEvery(LOGOUT_USER, logout);
}

const logoutAsync = async (history) => {
  await auth.signOut();
  history.push('/user/login');
};

function* logout({ payload }) {
  const { history } = payload;
  try {
    yield call(logoutAsync, history);
    localStorage.removeItem('user_id');
  } catch (error) {}
}

export function* watchForgotPassword() {
  yield takeEvery(FORGOT_PASSWORD, forgotPassword);
}

const forgotPasswordAsync = async (email) => {
  return await auth
    .sendPasswordResetEmail(email)
    .then((user) => user)
    .catch((error) => error);
};

function* forgotPassword({ payload }) {
  const { email } = payload.forgotUserMail;
  try {
    const forgotPasswordStatus = yield call(forgotPasswordAsync, email);
    if (!forgotPasswordStatus) {
      yield put(forgotPasswordSuccess('success'));
    } else {
      yield put(forgotPasswordError(forgotPasswordStatus.message));
    }
  } catch (error) {
    yield put(forgotPasswordError(error));
  }
}

export function* watchResetPassword() {
  yield takeEvery(RESET_PASSWORD, resetPassword);
}

const resetPasswordAsync = async (resetPasswordCode, newPassword) => {
  return await auth
    .confirmPasswordReset(resetPasswordCode, newPassword)
    .then((user) => user)
    .catch((error) => error);
};

function* resetPassword({ payload }) {
  const { newPassword, resetPasswordCode } = payload;
  try {
    const resetPasswordStatus = yield call(
      resetPasswordAsync,
      resetPasswordCode,
      newPassword
    );
    if (!resetPasswordStatus) {
      yield put(resetPasswordSuccess('success'));
    } else {
      yield put(resetPasswordError(resetPasswordStatus.message));
    }
  } catch (error) {
    yield put(resetPasswordError(error));
  }
}

export default function* rootSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchLogoutUser),
    fork(watchRegisterUser),
    fork(watchForgotPassword),
    fork(watchResetPassword),
  ]);
}
