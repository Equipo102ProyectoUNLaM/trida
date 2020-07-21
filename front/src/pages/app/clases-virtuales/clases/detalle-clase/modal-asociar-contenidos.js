import React from 'react';
import { Separator } from 'components/common/CustomBootstrap';
import { Row, Button, CustomInput, FormGroup, Label } from 'reactstrap';
import contenidos from 'pages/app/contenidos/contenidos';

class ModalAsociarContenidos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nombresContenidos: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    if (this.props.contenidos) {
      const nombresContenidos = this.props.contenidos.map((contenido) => {
        const paths = contenido.split('/');
        return paths[paths.length - 1];
      });

      this.setState({
        nombresContenidos,
      });
    }
  }

  isFileSelected = (file) => {
    if (this.state.nombresContenidos) {
      return this.state.nombresContenidos.some((archivo) => archivo === file);
    }
    return false;
  };

  handleFileChecked = (event) => {
    console.log(event.target.name);
  };

  render() {
    const { toggleModalContenidos, isLoading, files } = this.props;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <>
        {files.map((file) => {
          const isSelected = this.isFileSelected(file.key);
          console.log(this.props.contenidos, file, isSelected);

          return (
            <Row key={file.key}>
              <FormGroup>
                <div>
                  <CustomInput
                    id={file.key}
                    type="checkbox"
                    name={file.key}
                    label={<Label>{file.key}</Label>}
                    checked={isSelected}
                    onChange={this.handleFileChecked}
                  />
                </div>
              </FormGroup>
            </Row>
          );
        })}
        <Separator className="mb-5" />
        <Row className="button-group">
          <Button onClick={toggleModalContenidos} className="btn">
            Asociar Contenidos
          </Button>
        </Row>
      </>
    );
  }
}

export default ModalAsociarContenidos;
