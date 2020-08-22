import React, { Component, Fragment } from "react";

class CourseSelectionLayout extends Component {
  componentDidMount() {
    document.body.classList.add("background");
    document.body.classList.add("no-footer");
  }
  componentWillUnmount() {
    document.body.classList.remove("background");
    document.body.classList.remove("no-footer");
  }

  render() {
    return (
      <Fragment>
        <div className="fixed-background" />
        <main className="main-app">
          <div className="container">{this.props.children}</div>
        </main>
      </Fragment>
    );
  }
}

export default CourseSelectionLayout;
