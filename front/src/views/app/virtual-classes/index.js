import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Classes = React.lazy(() =>
  import(/* webpackChunkName: "application-todo" */ './classes')
);

const ClassDetail = React.lazy(() =>
  import(/* webpackChunkName: "application-todo" */ './class-detail')
);

const Board = React.lazy(() =>
  import(/* webpackChunkName: "application-todo" */ './board')
);

const VirtualClasses = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/classes`}
        render={props => <Classes {...props} />}
        isExact
      />
      <Route
        path={`${match.url}/class-detail`}
        render={props => <ClassDetail {...props} />}
        isExact
      />
      <Route path={`${match.url}/board`} render={props => <Board {...props} />} />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default VirtualClasses;