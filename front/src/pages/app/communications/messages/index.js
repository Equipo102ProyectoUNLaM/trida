import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Messages = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './messages')
);
const MessagesMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/`}
        render={props => <Messages {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default MessagesMenu;
