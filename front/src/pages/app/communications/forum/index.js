import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Forum = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './forum')
);
const ForumMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/`}
        render={props => <Forum {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default ForumMenu;
