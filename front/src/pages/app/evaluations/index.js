import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const MyEvaluations = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './my-evaluations')
);
const EvaluationsMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/`}
        render={props => <MyEvaluations {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default EvaluationsMenu;
