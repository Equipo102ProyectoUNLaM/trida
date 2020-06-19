import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Activities = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './activities')
);
const ActivitiesMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/activities`} />
      <Route
        path={`${match.url}/`}
        render={props => <Activities {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default ActivitiesMenu;
