import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Mensajeria = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './mensajeria')
);
const MenuMensajeria = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/`}
        render={props => <Mensajeria {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default MenuMensajeria;
