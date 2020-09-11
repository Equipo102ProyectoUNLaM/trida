import React from 'react';
import CanvasDraw from 'react-canvas-draw';
import { GithubPicker } from 'react-color';

const URL =
  'https://firebasestorage.googleapis.com/v0/b/trida-7f28f.appspot.com/o/materias%2FNJuvzb2birY1J4fkDMK4%2Fcontenidos%2Flogotrida.png?alt=media&token=9e738a7c-a7ac-4b76-b4ec-306cec8d41c5';

class CorreccionImagen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: '#ffc600',
      width: 400,
      height: 400,
      brushRadius: 10,
      lazyRadius: 0,
      colorPicker: false,
    };
  }

  handleChangeComplete = (color) => {
    this.setState({ color: color.hex });
    this.toggleColorPicker();
  };

  toggleColorPicker = () => {
    this.setState({ colorPicker: !this.state.colorPicker });
  };

  render() {
    const { colorPicker } = this.state;
    return (
      <>
        <div>
          <button
            onClick={() => {
              localStorage.setItem(
                'savedDrawing',
                this.saveableCanvas.getSaveData()
              );
            }}
          >
            Guardar
          </button>
          <button
            onClick={() => {
              this.saveableCanvas.clear();
            }}
          >
            Borrar todo
          </button>
          <button
            onClick={() => {
              this.saveableCanvas.undo();
            }}
          >
            Deshacer
          </button>
          <div>
            <label onClick={this.toggleColorPicker}>Color del pincel</label>
            <div
              style={{
                backgroundColor: 'black',
                width: '25px',
                height: '25px',
              }}
            ></div>
            {colorPicker && (
              <GithubPicker onChangeComplete={this.handleChangeComplete} />
            )}
          </div>
          <div>
            <label>Tamaño del pincel</label>
            <input
              type="number"
              value={this.state.brushRadius}
              onChange={(e) =>
                this.setState({ brushRadius: parseInt(e.target.value, 10) })
              }
            />
          </div>
        </div>
        <CanvasDraw
          imgSrc={URL}
          ref={(canvasDraw) => (this.saveableCanvas = canvasDraw)}
          brushColor={this.state.color}
          brushRadius={this.state.brushRadius}
          lazyRadius={this.state.lazyRadius}
          canvasWidth={this.state.width}
          canvasHeight={this.state.height}
        />
      </>
    );
  }
}

export default CorreccionImagen;
