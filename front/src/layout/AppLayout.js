import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter} from "react-router-dom";

import TopNav from "../containers/navegacion/Topnav";
import Sidebar from "../containers/navegacion/Sidebar";
import Footer from "../containers/navegacion/Footer";

class AppLayout extends Component {
  render() {
    const { containerClassnames } = this.props;
    return (
      <div id="app-container" className={containerClassnames}>
        <TopNav history={this.props.history} />
        <Sidebar />
        <main className="main-app">
          <div className="container-fluid">
          {this.props.children}
          </div>
        </main>
        <Footer/>
      </div>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};
const mapActionToProps={}

export default withRouter(connect(
  mapStateToProps,
  mapActionToProps
)(AppLayout));
