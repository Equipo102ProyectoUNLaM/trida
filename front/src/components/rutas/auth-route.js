import React, { Component, useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getDocument } from 'helpers/Firebase-db';
import EnEvaluacion from 'pages/en-evaluacion';

export const AuthRoute = ({ component: Component, authUser, ...rest }) => {
  const [enEvaluacion, setIniciada] = useState(false);

  const onEvaluacionIniciada = (doc) => {
    const { enEvaluacion } = doc.data;
    setIniciada(Boolean(enEvaluacion));
  };

  async function getUserState() {
    const doc = await getDocument(`usuarios/${authUser}`);
    onEvaluacionIniciada(doc);
  }

  useEffect(() => {
    if (authUser) {
      getUserState();
    }
  }, [authUser]);

  return (
    <Route
      {...rest}
      exact
      render={(props) =>
        authUser ? (
          enEvaluacion ? (
            <EnEvaluacion {...props} />
          ) : (
            <Component {...props} />
          )
        ) : (
          <Redirect
            to={{
              pathname: '/user/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};
