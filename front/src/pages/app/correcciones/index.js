import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Correcciones = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './correcciones')
);
const MenuCorrecciones = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/`}
        render={props => <Correcciones {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default MenuCorrecciones;
