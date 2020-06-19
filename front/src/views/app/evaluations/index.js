import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Evaluations = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './evaluations')
);
const EvaluationsMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/evaluations`} />
      <Route
        path={`${match.url}/`}
        render={props => <Evaluations {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default EvaluationsMenu;
