import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const PaginaAyuda = React.lazy(() =>
  import(/* webpackChunkName: "start" */ './ayuda')
);

const Ayuda = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/`}
        render={(props) => <PaginaAyuda {...props} />}
        exact
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Ayuda;
