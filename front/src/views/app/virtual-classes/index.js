import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Board = React.lazy(() =>
  import(/* webpackChunkName: "pages-product" */ './board')
);

const MyClasses = React.lazy(() =>
  import(/* webpackChunkName: "pages-profile" */ './my-classes')
);


const VirtualClassesMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/my-classes`} />
      <Route
        path={`${match.url}/my-classes`}
        render={props => <MyClasses {...props} />}
      />
      <Route
        path={`${match.url}/board`}
        render={props => <Board {...props} />}
      />      
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default VirtualClassesMenu;
