import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const FormalCommunications = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './formal')
);
const FormalMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/`}
        render={props => <FormalCommunications {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default FormalMenu;