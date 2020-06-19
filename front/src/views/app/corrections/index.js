import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Corrections = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './corrections')
);
const CorrectionsMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/corrections`} />
      <Route
        path={`${match.url}/`}
        render={props => <Corrections {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default CorrectionsMenu;
