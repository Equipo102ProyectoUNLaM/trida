import {
  LOGIN_USER_START,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  SET_LOGIN_USER,
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
import { getCollection } from 'helpers/Firebase-db';

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

export const setLoginUser = (user) => ({
  type: SET_LOGIN_USER,
  payload: { user },
});

export const registerUserError = (message) => ({
  type: REGISTER_USER_ERROR,
  payload: { message },
});

export const registerUser = (user) => async (dispatch) => {
  const { email, password, isInvited, instId, courseId, subjectId } = user;

  dispatch(registerUserStart());

  try {
    let registerUser = '';
    const user = functions.httpsCallable('user');
    const userAuth = await user({ email, password });
    const { data } = userAuth;
    if (data) {
      const { uid } = data;
      if (isInvited) {
        await sendInvitationEmail(email);
        await auth.sendPasswordResetEmail(email);

        const asignarMateriasAction = functions.httpsCallable(
          'asignarMaterias'
        );
        await asignarMateriasAction({
          instId,
          courseId,
          subjectId,
          uid,
        });
      } else {
        dispatch(setLoginUser(registerUser));
      }

      dispatch(registerUserSuccess(registerUser));
    } else {
      dispatch(registerUserError(registerUser.message));
    }
  } catch (error) {
    if (
      error.message === 'Este correo ya está siendo usado por otro usuario.'
    ) {
      const [userObj] = await getCollection('usuarios', [
        { field: 'mail', operator: '==', id: email },
      ]);
      const { id } = userObj;
      const asignarMateriasAction = functions.httpsCallable('asignarMaterias');
      await asignarMateriasAction({
        instId,
        courseId,
        subjectId,
        uid: id,
      });
      return dispatch(registerUserSuccess(registerUser));
    } else return dispatch(registerUserError(error.message));
  }
};

export const sendInvitationEmail = async (email) => {
  const sendMail = functions.httpsCallable('sendMail');
  sendMail(email).catch(function (error) {
    console.log(error);
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
    dispatch(forgotPasswordError(error.message));
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
