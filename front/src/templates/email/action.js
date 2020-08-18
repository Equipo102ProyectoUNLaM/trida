import React from 'react';
import { Redirect } from 'react-router-dom';
import RecoverEmail from './recover-email';
import ResetPassword from './reset-password';
import VerifyEmail from './verify-email';

// http://localhost:3000/action?mode=resetPassword&oobCode=ABC123&apiKey=AIzaSy

// mode - The user management action to be completed
// oobCode - A one-time code, used to identify and verify a request
// apiKey - Your Firebase project's API key, provided for convenience

const Action = (props) => {
  const params = new URLSearchParams(props.location.search);

  // Get the action to complete.
  const mode = params.get('mode');
  // Get the one-time code from the query parameter.
  const actionCode = params.get('oobCode');

  // (Optional) Get the API key from the query parameter.
  // const apiKey = props.location.query.apiKey;

  // Handle the user management action.
  switch (mode) {
    case 'recoverEmail':
      // Display reset password handler and UI.
      return <RecoverEmail actionCode={actionCode} />;
    case 'resetPassword':
      // Display email recovery handler and UI.
      return <ResetPassword actionCode={actionCode} />;
    case 'verifyEmail':
      // Display email verification handler and UI.
      return <VerifyEmail actionCode={actionCode} />;
    default:
      // Error: invalid mode.
      return <Redirect to="/error" />;
  }
};

export default Action;
