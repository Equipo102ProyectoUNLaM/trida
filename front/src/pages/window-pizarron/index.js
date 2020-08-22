import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import PizarronLayout from 'layout/PizarronLayout';

const Pizarron = React.lazy(() =>
  import(
    /* webpackChunkName: "second" */ '../app/clases-virtuales/pizarron/pizarron'
  )
);

const WindowPizarron = ({ match }) => {
  return (
    <PizarronLayout>
      <Suspense fallback={<div className="loading" />}>
        <Switch>
          <Route
            path={`${match.url}/`}
            render={(props) => <Pizarron {...props} fullscreen />}
            exact
          />
          <Redirect to="/error" />
        </Switch>
      </Suspense>
    </PizarronLayout>
  );
};

export default WindowPizarron;
