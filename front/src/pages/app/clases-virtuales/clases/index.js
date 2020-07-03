import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Clase = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './clases')
);

const DetalleClase = React.lazy(() =>
  import(/* webpackChunkName: "application-todo" */ './detalle-clase')
);

const MyClassesMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}`} to={`${match.url}/my-classes`} />
      <Route
        path={`${match.url}/my-classes`}
        render={(props) => <Clase {...props} />}
      />
      <Route
        path={`${match.url}/class-detail`}
        render={(props) => <DetalleClase {...props} />}
        isExact
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default MyClassesMenu;
