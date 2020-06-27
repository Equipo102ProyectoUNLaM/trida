import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Formal = React.lazy(() =>
  import(/* webpackChunkName: "pages-product" */ './formal')
);
const Forum = React.lazy(() =>
  import(/* webpackChunkName: "pages-profile" */ './forum')
);
const Messages = React.lazy(() =>
  import(/* webpackChunkName: "pages-miscellaneous" */ './messages')
);

const CommunicationsMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/formal`}
        render={props => <Formal {...props} />}
      />
      <Route
        path={`${match.url}/forum`}
        render={props => <Forum {...props} />}
      />
      <Route
        path={`${match.url}/messages`}
        render={props => <Messages {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default CommunicationsMenu;
