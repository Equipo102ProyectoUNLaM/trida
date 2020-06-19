import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const MyCorrections = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './my-corrections')
);
const CorrectionsMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/my-corrections`} />
      <Route
        path={`${match.url}/`}
        render={props => <MyCorrections {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default CorrectionsMenu;
