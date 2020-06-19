import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const MyContent = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './my-content')
);
const ContentMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/my-content`} />
      <Route
        path={`${match.url}/`}
        render={props => <MyContent {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default ContentMenu;
