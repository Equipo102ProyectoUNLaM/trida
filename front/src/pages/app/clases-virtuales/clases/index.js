import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Clase = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './clases')
);

const DetalleClase = React.lazy(() =>
  import(
    /* webpackChunkName: "application-todo" */ './detalle-clase/detalle-clase'
  )
);

const MyClassesMenu = ({ match }) => {
  return (
    <Suspense fallback={<div className="loading" />}>
      <Switch>
        <Route
          path={`${match.url}`}
          render={(props) => <Clase {...props} />}
          exact
        />
        <Route
          path={`${match.url}/detalle-clase/:claseId`}
          render={(props) => <DetalleClase {...props} />}
        />
        <Redirect to="/error" />
      </Switch>
    </Suspense>
  );
};
export default MyClassesMenu;
