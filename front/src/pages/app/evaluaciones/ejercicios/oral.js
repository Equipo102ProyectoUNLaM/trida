import React, { Fragment } from 'react';
import { Input, Label } from 'reactstrap';

class Oral extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tema: '',
    };
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({
        tema: this.props.value.tema,
      });
    }
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    if (!name || name.length === 0) return;
    this.setState({ [name]: value });
    this.props.onEjercicioChange({ [name]: value }, this.props.ejercicioId);
  };

  render() {
    const { preview } = this.props;
    return (
      <Fragment>
        {preview && (
          <div className="rta-libre-container">
            <Label>{this.state.tema}</Label>
          </div>
        )}

        {!preview && (
          <div className="rta-libre-container">
            <Label>Tema</Label>
            <Input
              name="tema"
              defaultValue={this.state.tema}
              onChange={this.handleChange}
            />
          </div>
        )}
      </Fragment>
    );
  }
}

export default Oral;
