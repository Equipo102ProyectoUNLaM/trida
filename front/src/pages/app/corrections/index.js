import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const MyCorrections = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './my-corrections')
);
const CorrectionsMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/`}
        render={props => <MyCorrections {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default CorrectionsMenu;
