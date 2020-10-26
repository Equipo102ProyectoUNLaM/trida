import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const PaginaCuenta = React.lazy(() =>
  import(/* webpackChunkName: "start" */ './cuenta')
);

const Cuenta = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/`}
        render={(props) => <PaginaCuenta {...props} />}
        exact
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Cuenta;
