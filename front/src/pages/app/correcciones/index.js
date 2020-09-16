import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Correcciones = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './correcciones')
);
const CorreccionTexto = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './correccion-texto')
);
const MenuCorrecciones = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/`}
        render={(props) => <Correcciones {...props} />}
        exact
      />
      <Route
        path={`${match.url}/correccion`}
        render={(props) => <CorreccionTexto {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default MenuCorrecciones;
