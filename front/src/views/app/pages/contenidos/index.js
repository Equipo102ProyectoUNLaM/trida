import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Contenidos = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './contenidos')
);
const ContenidosMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/contenidos`} />
      <Route
        path={`${match.url}/contenidos`}
        render={props => <Contenidos {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default ContenidosMenu;
