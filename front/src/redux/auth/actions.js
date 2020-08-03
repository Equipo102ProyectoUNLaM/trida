import {
  LOGIN_USER_START,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  REGISTER_USER_START,
  REGISTER_USER_SUCCESS,
  LOGIN_USER_ERROR,
  REGISTER_USER_ERROR,
  FORGOT_PASSWORD_START,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_ERROR,
  RESET_PASSWORD_START,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
} from '../actions';

import { auth, functions } from 'helpers/Firebase';
import { addDocumentWithId } from 'helpers/Firebase-db';
import { asignarMateriasAUsuario } from 'helpers/Firebase-user';
import { createRandomString } from 'helpers/Utils';

export const logoutUser = () => ({
  type: LOGOUT_USER,
});

export const loginUser = (email, password) => async (dispatch) => {
  dispatch(loginUserStart());

  try {
    const login = await auth.signInWithEmailAndPassword(email, password);
    if (!login.message) {
      dispatch(loginUserSuccess(login.user));
    } else {
      dispatch(loginUserError(login.message));
    }
  } catch (error) {
    dispatch(loginUserError(error));
  }
};

export const loginUserStart = (user, history) => ({
  type: LOGIN_USER_START,
  payload: { user, history },
});

export const loginUserSuccess = (user) => ({
  type: LOGIN_USER_SUCCESS,
  payload: user,
});

export const loginUserError = (message) => ({
  type: LOGIN_USER_ERROR,
  payload: { message },
});

export const forgotPasswordStart = (forgotUserMail, history) => ({
  type: FORGOT_PASSWORD_START,
  payload: { forgotUserMail, history },
});

export const forgotPasswordSuccess = (forgotUserMail) => ({
  type: FORGOT_PASSWORD_SUCCESS,
  payload: forgotUserMail,
});

export const forgotPasswordError = (message) => ({
  type: FORGOT_PASSWORD_ERROR,
  payload: { message },
});

export const resetPasswordStart = ({
  resetPasswordCode,
  newPassword,
  history,
}) => ({
  type: RESET_PASSWORD_START,
  payload: { resetPasswordCode, newPassword, history },
});

export const resetPasswordSuccess = (newPassword) => ({
  type: RESET_PASSWORD_SUCCESS,
  payload: newPassword,
});

export const resetPasswordError = (message) => ({
  type: RESET_PASSWORD_ERROR,
  payload: { message },
});

export const registerUserStart = (user, history) => ({
  type: REGISTER_USER_START,
  payload: { user, history },
});

export const registerUserSuccess = (user) => ({
  type: REGISTER_USER_SUCCESS,
  payload: { user },
});

export const registerUserError = (message) => ({
  type: REGISTER_USER_ERROR,
  payload: { message },
});

export const addRegisteredUserToDB = async (dispatch, registerUser, email) => {
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
    await addDocumentWithId('usuarios', userObj.id, userObj);
  } catch (error) {
    dispatch(registerUserError(error));
  }
};

export const registerUser = (user) => async (dispatch) => {
  const { email, password, isInvited, instId, courseId, subjectId } = user;

  dispatch(registerUserStart());

  try {
    const registerUser = await auth.createUserWithEmailAndPassword(
      email,
      password
    );

    if (!registerUser.message) {
      await addRegisteredUserToDB(dispatch, registerUser, email);

      if (isInvited) {
        const userObj = { payload: { forgotUserMail: { email: email } } };
        await forgotPassword(userObj);
        await sendInvitationEmail(email);

        await asignarMateriasAUsuario(
          instId,
          courseId,
          subjectId,
          registerUser.user.uid
        );
      }

      dispatch(registerUserSuccess(registerUser));
    } else {
      dispatch(registerUserError(registerUser.message));
    }
  } catch (error) {
    dispatch(registerUserError(error));
    return error;
  }
};

export const sendInvitationEmail = async (email) => {
  const req = { query: { dest: email } };
  const sendMail = functions.httpsCallable('sendMail'); //send email function
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

export const logout = () => async (dispatch) => {
  dispatch(logoutUser());
  await auth.signOut();
};

export const forgotPassword = (email) => async (dispatch) => {
  dispatch(forgotPasswordStart());

  try {
    const forgotPasswordStatus = await auth.sendPasswordResetEmail(email);
    if (!forgotPasswordStatus) {
      dispatch(forgotPasswordSuccess('success'));
    } else {
      dispatch(forgotPasswordError(forgotPasswordStatus.message));
    }
  } catch (error) {
    dispatch(forgotPasswordError(error));
  }
};

export const resetPassword = (newPassword, resetPasswordCode) => async (
  dispatch
) => {
  dispatch(resetPasswordStart());

  try {
    const resetPasswordStatus = await auth.confirmPasswordReset(
      resetPasswordCode,
      newPassword
    );
    if (!resetPasswordStatus) {
      dispatch(resetPasswordSuccess('success'));
    } else {
      dispatch(resetPasswordError(resetPasswordStatus.message));
    }
  } catch (error) {
    dispatch(resetPasswordError(error));
  }
};
