import React from 'react';
import { isMobile } from 'react-device-detect';
import ReactDOMServer from 'react-dom/server';

export const dropzoneComponentConfig = {
  postUrl: 'https://httpbin.org/post',
};

const dropzoneMessage = () => {
  return isMobile
    ? 'Presioná acá para agregar tus archivos. Luego seleccioná la carpeta en la que querés cargarlos.'
    : 'Arrastrá tus archivos, o hacé click para agregar. Luego seleccioná la carpeta en la que querés cargarlos.';
};

export const dropzoneConfig = {
  thumbnailHeight: 160,
  maxFilesize: 2,
  uploadMultiple: true,
  dictDefaultMessage: dropzoneMessage(),
  previewTemplate: ReactDOMServer.renderToStaticMarkup(
    <div className="dz-preview dz-file-preview mb-3">
      <div className="d-flex flex-row ">
        <div className="p-0 w-30 position-relative">
          <div className="dz-error-mark">
            <span>
              <i />{' '}
            </span>
          </div>
          <div className="dz-success-mark">
            <span>
              <i />
            </span>
          </div>
          <div className="preview-container">
            <img
              alt="img"
              data-dz-thumbnail
              className="img-thumbnail border-0"
            />
            <i className="simple-icon-doc preview-icon" />
          </div>
        </div>
        <div className="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
          <div>
            {' '}
            <span data-dz-name />{' '}
          </div>
          <div className="text-primary text-extra-small" data-dz-size />
          <div className="dz-progress">
            <span className="dz-upload" data-dz-uploadprogress />
          </div>
          <div className="dz-error-message">
            <span data-dz-errormessage />
          </div>
        </div>
      </div>
      <a href="#/" className="remove" id="buttonRemove" data-dz-remove>
        {' '}
        <i className="glyph-icon simple-icon-trash" />{' '}
      </a>
    </div>
  ),
  headers: { 'My-Awesome-Header': 'header value' },
};
