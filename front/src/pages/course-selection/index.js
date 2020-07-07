import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import CourseSelectionLayout from '../../layout/CourseSelectionLayout';

const Institution = React.lazy(() =>
  import(/* webpackChunkName: "user-login" */ './institution')
);
const Course = React.lazy(() =>
  import(/* webpackChunkName: "user-register" */ './course')
);

const CourseSelectionMenu = ({ match }) => {
  return (
    <CourseSelectionLayout>
      <Suspense fallback={<div className="loading" />}>
        <Switch>
          <Redirect
            exact
            from={`${match.url}/`}
            to={`${match.url}/institution`}
          />
          <Route
            path={`${match.url}/institution`}
            render={(props) => <Institution {...props} />}
          />
          <Route
            path={`${match.url}/course/:institutionId`}
            render={(props) => <Course {...props} />}
          />
          <Redirect to="/error" />
        </Switch>
      </Suspense>
    </CourseSelectionLayout>
  );
};

export default CourseSelectionMenu;
