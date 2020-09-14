import React, { Fragment } from 'react';
import { Input, Label, FormGroup } from 'reactstrap';

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
    const { preview, resolve } = this.props;
    const { tema } = this.state;
    return (
      <Fragment>
        {preview && (
          <div>
            <Label>{this.state.tema}</Label>
          </div>
        )}

        {resolve && (
          <div>
            <Label>Exposición oral: {this.state.tema}</Label>
          </div>
        )}

        {!preview && !resolve && (
          <div>
            <FormGroup className="mb-3 error-l-50">
              <Label>Tema</Label>
              <Input
                name="tema"
                defaultValue={tema}
                onInputCapture={this.handleChange}
              />
              {this.props.submitted && !tema ? (
                <div className="invalid-feedback d-block">
                  El tema es requerido
                </div>
              ) : null}
            </FormGroup>
          </div>
        )}
      </Fragment>
    );
  }
}

export default Oral;
