import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

const Home = React.lazy(() =>
  import('./home')
);

const VirtualClasses = React.lazy(() =>
  import('./virtual-classes')
);

const Communications = React.lazy(() =>
  import('./communications')
);

const Content = React.lazy(() =>
  import('./content')
);

const Corrections = React.lazy(() =>
  import('./corrections')
);

const Evaluations = React.lazy(() =>
  import('./evaluations')
);

const Activities = React.lazy(() =>
  import('./activities')
);

class App extends Component {
  render() {
    const { match } = this.props;

    return (
      <AppLayout>
        <div className="dashboard-wrapper">
          <Suspense fallback={<div className="loading" />}>
            <Switch>
              <Redirect exact from={`${match.url}/`} to={`${match.url}/home`} />
              <Route
                path={`${match.url}/home`}
                render={props => <Home {...props} />}
              />
              <Route
                path={`${match.url}/virtual-classes`}
                render={props => <VirtualClasses {...props} />}
              />
              <Route
                path={`${match.url}/content`}
                render={props => <Content {...props} />}
              />
              <Route
                path={`${match.url}/communications`}
                render={props => <Communications {...props} />}
              />
              <Route
                path={`${match.url}/corrections`}
                render={props => <Corrections {...props} />}
              />

              <Route
                path={`${match.url}/activities`}
                render={props => <Activities {...props} />}
              />
              <Route
                path={`${match.url}/evaluations`}
                render={props => <Evaluations {...props} />}
              />
              <Redirect to="/error" />
            </Switch>
          </Suspense>
        </div>
      </AppLayout>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(App)
);
