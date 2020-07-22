import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Pizarron = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './pizarron')
);

const PizarronCompartido = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './pizarron-compartido')
);

const MenuPizarron = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/`}
        render={(props) => <Pizarron {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default MenuPizarron;
