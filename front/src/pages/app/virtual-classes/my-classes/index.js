import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const MyClasses = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './my-classes')
);

const ClassDetail = React.lazy(() =>
  import(/* webpackChunkName: "application-todo" */ './class-detail')
);


const MyClassesMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
    <Redirect exact from={`${match.url}`} to={`${match.url}/my-classes`} />
      <Route
        path={`${match.url}/my-classes`}
        render={props => <MyClasses {...props} />}
      />
      <Route
        path={`${match.url}/class-detail`}
        render={props => <ClassDetail {...props} />}
        isExact
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default MyClassesMenu;
