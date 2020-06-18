import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Correcciones = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './correcciones')
);
const CorreccionesMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/correcciones`} />
      <Route
        path={`${match.url}/`}
        render={props => <Correcciones {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default CorreccionesMenu;
