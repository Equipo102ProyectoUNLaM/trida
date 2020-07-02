import React from "react";
import Excalidraw from "excalidraw";
 
import "excalidraw/dist/excalidraw.min.css";
 
class Pizarron extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 800
    }

    this.boardParentEl = React.createRef();
  }

  componentDidMount() {
    this.getParentDimensions();
  }

  getParentDimensions = () => {
    if(this.boardParentEl.current) {
      this.setState({
        width: this.boardParentEl.current.clientWidth,
        height: this.boardParentEl.current.clientHeight,
      });
    }
  };

  onChange = (elements, state) => {
    console.log("Elements :", elements, "State : ", state);
  };
 
  onUsernameChange = (username) => {
    console.log("current username", username);
  };

  render() {
    const { width, height } = this.state;
    const options = { zenModeEnabled: false, viewBackgroundColor: "#ffffff" };

    return (
      <div className="board" ref={this.boardParentEl}>
        <Excalidraw
          width={width}
          height={height}
          onResize={this.getParentDimensions}
          onChange={this.onChange}
          options={options}
          user={{ name: "Excalidraw User" }}
          onUsernameChange={this.onUsernameChange}
        />
      </div>
    );
  }
}
export default Pizarron;