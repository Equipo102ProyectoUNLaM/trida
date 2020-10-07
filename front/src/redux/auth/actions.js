import {
  LOGIN_USER_START,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  SET_LOGIN_USER,
  REGISTER_USER_START,
  REGISTER_USER_SUCCESS,
  UPDATE_DATOS_USUARIO,
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
import { getCollection, editDocument } from 'helpers/Firebase-db';
import { getUserData } from 'helpers/Firebase-user';
import { addMail, inviteMail } from 'constants/emailTexts';
import { authErrorMessage } from 'constants/errorMessages';
import { enviarNotificacionError } from 'helpers/Utils-ui';

export const logoutUser = () => ({
  type: LOGOUT_USER,
});

export const loginUser = (email, password) => async (dispatch) => {
  dispatch(loginUserStart());

  try {
    const login = await auth.signInWithEmailAndPassword(email, password);
    if (!login.message) {
      const data = await getUserData(`${login.user.uid}`);
      dispatch(loginUserSuccess(login.user, data));
    } else {
      dispatch(loginUserError(login.message));
    }
  } catch (error) {
    const errorMessage = authErrorMessage(error.message);
    dispatch(loginUserError(errorMessage));
  }
};

export const loginUserStart = (user, history) => ({
  type: LOGIN_USER_START,
  payload: { user, history },
});

export const loginUserSuccess = (user, userData) => ({
  type: LOGIN_USER_SUCCESS,
  payload: { user, userData },
});

export const loginUserError = (message) => ({
  type: LOGIN_USER_ERROR,
  payload: { message },
});

export const updateDatosUsuario = (userData) => ({
  type: UPDATE_DATOS_USUARIO,
  payload: { userData },
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

export const registerUserSuccess = () => ({
  type: REGISTER_USER_SUCCESS,
});

export const registerUserError = (message) => ({
  type: REGISTER_USER_ERROR,
  payload: { message },
});

export const registerUser = (user) => async (dispatch) => {
  const { email, password, isInvited, rol, instId, courseId, subjectId } = user;
  dispatch(registerUserStart());

  try {
    let registerUser = '';
    const user = functions.httpsCallable('user');
    const userAuth = await user({ email, password, rol });
    const { data } = userAuth;

    if (data) {
      const { uid } = data;

      if (isInvited) {
        await sendInvitationEmail(email, inviteMail);
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
      }

      await editDocument('usuarios', uid, { rol });
      dispatch(registerUserSuccess());
    } else {
      dispatch(registerUserError(registerUser.message));
    }
  } catch (error) {
    if (
      error.message === 'Este correo ya está siendo usado por otro usuario.'
    ) {
      if (isInvited) {
        const [userObj] = await getCollection('usuarios', [
          { field: 'mail', operator: '==', id: email },
        ]);
        const { id } = userObj;
        const agregarMaterias = functions.httpsCallable('agregarMaterias');
        await agregarMaterias({
          instId,
          courseId,
          subjectId,
          uid: id,
        });
        await sendInvitationEmail(email, addMail);
        return dispatch(registerUserSuccess(registerUser));
      } else {
        dispatch(registerUserError(registerUser.message));
        return enviarNotificacionError(error.message, 'Error');
      }
    } else return dispatch(registerUserError(registerUser.message));
  }
};

export const sendInvitationEmail = async (email, options) => {
  const sendMail = functions.httpsCallable('sendMail');

  sendMail({ email, ...options }).catch(function (error) {
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
