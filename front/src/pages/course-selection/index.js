import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import CourseSelectionLayout from '../../layout/CourseSelectionLayout';

const Institution = React.lazy(() =>
  import(/* webpackChunkName: "user-login" */ './institution')
);
const Course = React.lazy(() =>
  import(/* webpackChunkName: "user-register" */ './course')
);

const FormInstitucion = React.lazy(() =>
  import(/* webpackChunkName: "user-register" */ './creacion/form-institucion')
);

const FormCurso = React.lazy(() =>
  import(/* webpackChunkName: "user-register" */ './creacion/form-curso')
);

const FormMateria = React.lazy(() =>
  import(/* webpackChunkName: "user-register" */ './creacion/form-materia')
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
          <Route
            path={`${match.url}/crear-institucion`}
            render={(props) => <FormInstitucion {...props} />}
            exact
          />
          <Route
            path={`${match.url}/crear-curso`}
            render={(props) => <FormCurso {...props} />}
            exact
          />
          <Route
            path={`${match.url}/crear-materia`}
            render={(props) => <FormMateria {...props} />}
            exact
          />
          <Redirect to="/error" />
        </Switch>
      </Suspense>
    </CourseSelectionLayout>
  );
};

export default CourseSelectionMenu;
