import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const MyEvaluations = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './my-evaluations')
);
const EvaluationsMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/my-evaluations`} />
      <Route
        path={`${match.url}/`}
        render={props => <MyEvaluations {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default EvaluationsMenu;
