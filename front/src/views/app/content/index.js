import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Content = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './content')
);
const ContentMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/content`} />
      <Route
        path={`${match.url}/`}
        render={props => <Content {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default ContentMenu;
