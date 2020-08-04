import {
  LOGIN_USER_START,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  SET_LOGIN_USER,
  REGISTER_USER_START,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGOUT_USER,
  FORGOT_PASSWORD_START,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_ERROR,
  RESET_PASSWORD_START,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
} from '../actions';

const INIT_STATE = {
  user: '',
  forgotUserMail: '',
  newPassword: '',
  resetPasswordCode: '',
  loading: false,
  error: '',
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER_START:
    case FORGOT_PASSWORD_START:
    case RESET_PASSWORD_START:
    case REGISTER_USER_START:
      return { ...state, loading: true, error: '' };

    case LOGIN_USER_SUCCESS:
      return { ...state, loading: false, user: action.payload.uid, error: '' };

    case LOGIN_USER_ERROR:
      return {
        ...state,
        loading: false,
        user: '',
        error: action.payload.message,
      };

    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        forgotUserMail: action.payload,
        error: '',
      };

    case FORGOT_PASSWORD_ERROR:
      return {
        ...state,
        loading: false,
        forgotUserMail: '',
        error: action.payload.message,
      };

    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        newPassword: action.payload,
        resetPasswordCode: '',
        error: '',
      };

    case RESET_PASSWORD_ERROR:
      return {
        ...state,
        loading: false,
        newPassword: '',
        resetPasswordCode: '',
        error: action.payload.message,
      };

    case SET_LOGIN_USER:
      return { ...state, user: action.payload.uid };

    case REGISTER_USER_SUCCESS:
      return { ...state, loading: false, error: '' };

    case REGISTER_USER_ERROR:
      return {
        ...state,
        loading: false,
        user: '',
        error: action.payload.message,
      };

    case LOGOUT_USER:
      return { ...state, user: null, error: '' };

    default:
      return { ...state };
  }
};
