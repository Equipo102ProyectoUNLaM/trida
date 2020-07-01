import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Clase = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './clases')
);

const DetalleClase = React.lazy(() =>
  import(/* webpackChunkName: "application-todo" */ './detalle-clase')
);

const PaginaVideollamada = React.lazy(() =>
  import(/* webpackChunkName: "application-todo" */ './videollamada')
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
        path={`${match.url}/class-detail/:claseId`}
        render={(props) => <DetalleClase {...props} />}
      />
      <Route
        path={`${match.url}/videollamada`}
        render={(props) => <PaginaVideollamada {...props} />}
        isExact
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default MyClassesMenu;
