import React, { Suspense, Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Redirect, withRouter, Route } from 'react-router-dom';

const Landing = React.lazy(() =>
  import(/* webpackChunkName: "user-login" */ './landing')
);

class LandingPage extends Component {
  render() {
    const { match } = this.props;

    return (
      <Suspense fallback={<div className="loading" />}>
        <Switch>
          <Route
            path={`${match.url}/`}
            render={(props) => <Landing {...props} />}
            exact
          />
          <Redirect to="/error" />
        </Switch>
      </Suspense>
    );
  }
}

export default withRouter(LandingPage);
