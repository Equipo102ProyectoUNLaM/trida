import React, { Suspense, Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Redirect, withRouter } from 'react-router-dom';
import UserLayout from '../../layout/UserLayout';
import { AuthRoute } from 'components/rutas/auth-route';
import { NonAuthRoute } from 'components/rutas/non-auth-route';

const Landing = React.lazy(() =>
  import(/* webpackChunkName: "user-login" */ './landing')
);

class LandingPage extends Component {
  render() {
    const { loginUser, match } = this.props;
    return (
      <UserLayout>
        <Suspense fallback={<div className="loading" />}>
          <Switch>
            <Redirect
              exact
              from={`${match.url}/`}
              to={`${match.url}/landing`}
            />
            <NonAuthRoute
              path={`${match.url}/landing`}
              component={Landing}
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

export default withRouter(connect(mapStateToProps)(LandingPage));
