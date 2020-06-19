import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const MyActivities = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './my-activities')
);
const ActivitiesMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/my-activities`} />
      <Route
        path={`${match.url}/`}
        render={props => <MyActivities {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default ActivitiesMenu;
