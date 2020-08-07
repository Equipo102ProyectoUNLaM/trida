import React, { Suspense, Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import UserLayout from '../../layout/UserLayout';

const Login = React.lazy(() =>
  import(/* webpackChunkName: "user-login" */ './login')
);
const Register = React.lazy(() =>
  import(/* webpackChunkName: "user-register" */ './register')
);
const ForgotPassword = React.lazy(() =>
  import(/* webpackChunkName: "user-forgot-password" */ './forgot-password')
);
const ResetPassword = React.lazy(() =>
  import(/* webpackChunkName: "user-reset-password" */ './reset-password')
);
const PrimerLogin = React.lazy(() =>
  import(/* webpackChunkName: "user-primer-login" */ './primer-login')
);
const CambiarPassword = React.lazy(() =>
  import(/* webpackChunkName: "user-cambiar-password" */ './cambiar-password')
);

const NonAuthRoute = ({ component: Component, authUser, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !authUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

const AuthRoute = ({ component: Component, authUser, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        authUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/user/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

class User extends Component {
  render() {
    const { loginUser, match } = this.props;
    return (
      <UserLayout>
        <Suspense fallback={<div className="loading" />}>
          <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/login`} />
            <NonAuthRoute
              path={`${match.url}/login`}
              component={Login}
              authUser={loginUser}
            />
            <NonAuthRoute
              path={`${match.url}/register`}
              component={Register}
              authUser={loginUser}
            />
            <NonAuthRoute
              path={`${match.url}/forgot-password`}
              component={ForgotPassword}
              authUser={loginUser}
            />
            <NonAuthRoute
              path={`${match.url}/reset-password`}
              component={ResetPassword}
              authUser={loginUser}
            />
            <AuthRoute
              path={`${match.url}/primer-login`}
              component={PrimerLogin}
              authUser={loginUser}
            />
            <AuthRoute
              path={`${match.url}/cambiar-password`}
              component={CambiarPassword}
              authUser={loginUser}
            />
            <Redirect to="/error" />
          </Switch>
        </Suspense>
      </UserLayout>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user: loginUser } = authUser;
  return { loginUser };
};

export default withRouter(connect(mapStateToProps)(User));
