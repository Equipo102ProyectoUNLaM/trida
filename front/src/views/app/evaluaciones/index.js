import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Evaluaciones = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './evaluaciones')
);
const EvaluacionesMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/evaluaciones`} />
      <Route
        path={`${match.url}/`}
        render={props => <Evaluaciones {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default EvaluacionesMenu;
