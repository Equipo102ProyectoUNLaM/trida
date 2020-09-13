import React from 'react';
import html2canvas from 'html2canvas';
import { SketchField, Tools } from 'react-sketch';
import { GithubPicker } from 'react-color';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Card from '@material-ui/core/Card';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import MenuItem from '@material-ui/core/MenuItem';
import Slider from '@material-ui/core/Slider';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import json from './enjson.json';

const URL =
  'https://firebasestorage.googleapis.com/v0/b/trida-7f28f.appspot.com/o/materias%2FNJuvzb2birY1J4fkDMK4%2Fcontenidos%2Flogotrida.png?alt=media&token=9e738a7c-a7ac-4b76-b4ec-306cec8d41c5';

class CorreccionImagen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lineColor: '#ffc600',
      fillWithColor: '',
      width: 400,
      height: 400,
      brushRadius: 5,
      lazyRadius: 0,
      colorPicker: false,
      text: '',
      tool: Tools.Pencil,
      lineWidth: 13,
      canUndo: false,
      canRedo: false,
      expandTools: false,
      drawings: [],
    };
  }

  componentDidMount() {
    //this.correccion.addImg(URL);
    console.log(json);
    this.correccion.fromJSON(json);

    (function (console) {
      console.save = function (data, filename) {
        if (!data) {
          console.error('Console.save: No data');
          return;
        }
        if (!filename) filename = 'console.json';
        if (typeof data === 'object') {
          data = JSON.stringify(data, undefined, 4);
        }
        var blob = new Blob([data], { type: 'text/json' }),
          e = document.createEvent('MouseEvents'),
          a = document.createElement('a');
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initMouseEvent(
          'click',
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
        a.dispatchEvent(e);
      };
    })(console);
  }

  handleChangeComplete = (color) => {
    this.setState({ color: color.hex });
    this.toggleColorPicker();
  };

  toggleColorPicker = () => {
    this.setState({ colorPicker: !this.state.colorPicker });
  };

  agregarTexto = () => this.correccion.addText(this.state.text);

  _selectTool = (event) => {
    this.setState({
      tool: event.target.value,
      enableRemoveSelected: event.target.value === Tools.Select,
      enableCopyPaste: event.target.value === Tools.Select,
    });
  };

  _save = () => {
    let drawings = this.state.drawings;
    drawings.push(this.correccion.toDataURL());
    this.setState({ drawings: drawings });
  };

  _download = () => {
    console.save(this.correccion.toJSON(), 'enjson.json');

    html2canvas(document.getElementsByClassName('canvas-area')[0], {
      useCORS: true,
    }).then(function (canvas) {
      console.save(canvas.toJSON(), 'enjson2.json');
    });
  };

  _removeMe = (index) => {
    let drawings = this.state.drawings;
    drawings.splice(index, 1);
    this.setState({ drawings: drawings });
  };

  _undo = () => {
    this.correccion.undo();
    this.setState({
      canUndo: this.correccion.canUndo(),
      canRedo: this.correccion.canRedo(),
    });
  };

  _redo = () => {
    this.correccion.redo();
    this.setState({
      canUndo: this.correccion.canUndo(),
      canRedo: this.correccion.canRedo(),
    });
  };

  _clear = () => {
    this.correccion.clear();
    this.correccion.addImg(URL);
    this.setState({
      controlledValue: null,
      backgroundColor: 'transparent',
      fillWithBackgroundColor: false,
      canUndo: this.correccion.canUndo(),
      canRedo: this.correccion.canRedo(),
    });
  };

  _removeSelected = () => {
    this.correccion.removeSelected();
  };

  _onSketchChange = () => {
    let prev = this.state.canUndo;
    let now = this.correccion.canUndo();
    if (prev !== now) {
      this.setState({ canUndo: now });
    }
  };

  render() {
    return (
      <>
        <Toolbar>
          <IconButton
            color="primary"
            disabled={!this.state.canUndo}
            onClick={this._undo}
          >
            <UndoIcon />
          </IconButton>
          <IconButton
            color="primary"
            disabled={!this.state.canRedo}
            onClick={this._redo}
          >
            <RedoIcon />
          </IconButton>
          <IconButton color="primary" onClick={this._save}>
            <SaveIcon />
          </IconButton>
          <IconButton color="primary" onClick={this._download}>
            <DownloadIcon />
          </IconButton>
          <IconButton color="primary" onClick={this._clear}>
            <DeleteIcon />
          </IconButton>
        </Toolbar>
        <div className="row">
          <div className="col-xs-7 col-sm-7 col-md-9 col-lg-8">
            <SketchField
              name="correccion"
              className="canvas-area"
              ref={(c) => (this.correccion = c)}
              width="800px"
              height="600px"
              tool={this.state.tool}
              lineColor={this.state.lineColor}
              lineWidth={this.state.lineWidth}
              imageUrl={URL}
              onChange={this._onSketchChange}
            />
          </div>
          <div className="col-xs-5 col-sm-5 col-md-6 col-lg-4">
            <Card>
              <CardHeader
                title="Herramientas"
                action={
                  <IconButton
                    onClick={(e) =>
                      this.setState({ expandTools: !this.state.expandTools })
                    }
                  >
                    <ExpandMore />
                  </IconButton>
                }
              />
              <Collapse in={this.state.expandTools}>
                <CardContent>
                  <div className="row">
                    <div className="col-lg-12">
                      <TextField
                        select={true}
                        label="Herramienta"
                        value={this.state.tool}
                        onChange={this._selectTool}
                      >
                        <MenuItem value={Tools.Select} key="Select">
                          Seleccionar
                        </MenuItem>
                        <MenuItem value={Tools.Pencil} key="Pencil">
                          Lápiz
                        </MenuItem>
                        <MenuItem value={Tools.Line} key="Line">
                          Linea
                        </MenuItem>
                        <MenuItem value={Tools.Rectangle} key="Rectangle">
                          Rectángulo
                        </MenuItem>
                        <MenuItem value={Tools.Circle} key="Circle">
                          Círculo
                        </MenuItem>
                        <MenuItem value={Tools.Pan} key="Pan">
                          Mover todo
                        </MenuItem>
                      </TextField>
                    </div>
                  </div>
                  <br />
                  <br />
                  <span id="slider">Ancho de linea</span>
                  <Slider
                    step={1}
                    min={0}
                    max={100}
                    aria-labelledby="slider"
                    value={this.state.lineWidth}
                    onChange={(e, v) => {
                      this.setState({ lineWidth: v });
                      console.log(this.state.lineWidth);
                    }}
                  />
                  <br />
                  <label htmlFor="zoom">Zoom</label>
                  <div>
                    <IconButton onClick={(e) => this.correccion.zoom(1.25)}>
                      <ZoomInIcon />
                    </IconButton>
                    <IconButton onClick={(e) => this.correccion.zoom(0.8)}>
                      <ZoomOutIcon />
                    </IconButton>
                  </div>
                  <div className="row">
                    <div className="col-lg-7">
                      <TextField
                        label="Texto"
                        helperText="Agregar texto"
                        onChange={(e) =>
                          this.setState({ text: e.target.value })
                        }
                        value={this.state.text}
                      />
                    </div>
                    <div className="col-lg-3">
                      <IconButton color="primary" onClick={this.agregarTexto}>
                        <AddIcon />
                      </IconButton>
                    </div>
                  </div>
                </CardContent>
              </Collapse>
            </Card>
            <Card>
              <CardHeader
                title="Colores"
                action={
                  <IconButton
                    onClick={(e) =>
                      this.setState({ expandColors: !this.state.expandColors })
                    }
                  >
                    <ExpandMore />
                  </IconButton>
                }
              />
              <Collapse in={this.state.expandColors}>
                <CardContent>
                  <label htmlFor="lineColor">Linea</label>
                  <br />
                  <GithubPicker
                    id="lineColor"
                    color={this.state.lineColor}
                    onChange={(color) =>
                      this.setState({ lineColor: color.hex })
                    }
                  />
                  <br />
                  <br />
                  <FormControlLabel
                    control={
                      <Switch
                        value={this.state.fillWithColor}
                        onChange={(e) =>
                          this.setState({
                            fillWithColor: !this.state.fillWithColor,
                          })
                        }
                      />
                    }
                    label="Relleno"
                  />
                  <GithubPicker
                    color={this.state.fillColor}
                    onChange={(color) =>
                      this.setState({ fillColor: color.hex })
                    }
                  />
                </CardContent>
              </Collapse>
            </Card>
          </div>
        </div>
      </>
    );
  }
}

export default CorreccionImagen;
