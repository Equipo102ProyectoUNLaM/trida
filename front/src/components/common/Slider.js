import React, { Fragment } from 'react';
import Slider from 'rc-slider';
import { MARKS } from 'constants/emojiSlider';
import 'rc-slider/assets/index.css';

const sliderHandle = (props) => {
  const { value, dragging, index, offset, ...restProps } = props;
  return (
    <Fragment key={index}>
      <Slider.Handle value={value} offset={offset} {...restProps} />
    </Fragment>
  );
};

export class SliderTooltip extends React.Component {
  render() {
    return (
      <Slider
        onChange={(value) => this.props.onChange(value)}
        marks={MARKS}
        handle={this.props.handle || sliderHandle}
        {...this.props}
      />
    );
  }
}
