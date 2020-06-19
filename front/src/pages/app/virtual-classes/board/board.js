import React, { Component, Fragment, useState } from "react";
import { Row } from "reactstrap";
import IntlMessages from "../../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../../containers/navs/Breadcrumb";
import ReactDOM from "react-dom";
import Excalidraw from "excalidraw";
import initialBoardData from "../../../../data/initialBoardData";
import "excalidraw/dist/excalidraw.min.css";

export default function Board() {
  const onChange = (elements, state) => {
    console.log("Elements :", elements, "State : ", state);
  };
 
  const onUsernameChange = (username) => {
    console.log("current username", username);
  };
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
 
  const onResize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };
  const { width, height } = dimensions;
  const options = { zenModeEnabled: true, viewBackgroundColor: "AFEEEE" };
  return (
    <div className="App">
      <Excalidraw
        width={width}
        height={height}
        onResize={onResize}
        //initialData={initialBoardData}
        onChange={onChange}
        options={options}
        user={{ name: "Excalidraw User" }}
        onUsernameChange={onUsernameChange}
      />
    </div>
  );
}