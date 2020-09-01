import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Realizar = React.lazy(() => import('./realizar-evaluacion'));
const RealizarEvaluacion = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        exact
        path={`${match.url}/`}
        render={(props) => <Realizar {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default RealizarEvaluacion;
