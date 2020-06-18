import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Contenidos = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './contenidos')
);
const ContenidosMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/`}
        render={props => <Contenidos {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default ContenidosMenu;
