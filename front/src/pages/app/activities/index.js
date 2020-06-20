import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const MyActivities = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './my-activities')
);
const ActivitiesMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/`}
        render={props => <MyActivities {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default ActivitiesMenu;
