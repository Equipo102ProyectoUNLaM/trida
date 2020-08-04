import React from 'react';
import { Tooltip } from 'reactstrap';

class TooltipItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipOpen: false,
    };
  }
  toggle = () => {
    this.setState((prevState) => ({
      tooltipOpen: !prevState.tooltipOpen,
    }));
  };

  render() {
    return (
      <span className="tooltip-question">
        <i className="simple-icon-question" id={this.props.id} />
        <Tooltip
          placement="right"
          isOpen={this.state.tooltipOpen}
          target={this.props.id}
          toggle={this.toggle}
        >
          {this.props.body}
        </Tooltip>
      </span>
    );
  }
}
export default TooltipItem;
