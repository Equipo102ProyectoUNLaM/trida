import React, { Component } from 'react';
import DropzoneComponent from 'react-dropzone-component';
import 'dropzone/dist/min/dropzone.min.css';
import {
  dropzoneComponentConfig,
  dropzoneConfig,
} from 'constants/dropzoneValues';

export default class Dropzone extends Component {
  clear() {
    this.myDropzone.removeAllFiles(true);
  }

  render() {
    return (
      <DropzoneComponent
        config={dropzoneComponentConfig}
        djsConfig={dropzoneConfig}
        eventHandlers={{
          init: (dropzone) => {
            this.myDropzone = dropzone;
            this.props.parentCallback(true, null);
          },
          queuecomplete: (dropzone) => {
            this.myDropzone = dropzone;
            this.props.parentCallback(false, dropzone);
          },
          processingmultiple: (dropzone) => {
            this.myDropzone = dropzone;
            this.props.parentCallback(true, dropzone);
          },
          removedfile: (file) => {
            this.props.deleteFile(file);
          },
        }}
      ></DropzoneComponent>
    );
  }
}
