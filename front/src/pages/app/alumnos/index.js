import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const PaginaAlumnos = React.lazy(() =>
  import(/* webpackChunkName: "start" */ './alumnos')
);
const Alumnos = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/`}
        render={(props) => <PaginaAlumnos {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Alumnos;
