import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import FileBrowser, { Icons } from 'react-keyed-file-browser';
import { storage } from 'helpers/Firebase';
import { injectIntl } from 'react-intl';
import Moment from 'moment';
import '../../../../node_modules/react-keyed-file-browser/dist/react-keyed-file-browser.css';

class Correcciones extends Component {
  constructor(props) {
    super(props);
    const subject = JSON.parse(localStorage.getItem('subject'));

    this.state = {
      files: [],
      isLoading: true,
      subjectId: subject.id,
    };
  }

  async componentDidMount() {
    await this.getCorrecciones();
  }

  async getCorrecciones() {
    let arrayFiles = [];

    try {
      console.log(this.state.subjectId);
      //Obtenemos la referencia de la carpeta que quiero listar (La de la materia)
      const listRef = storage.ref(this.state.subjectId + '/correcciones');
      await listRef.listAll().then(async (result) => {
        //Archivos
        let ctrFiles = 0;
        result.items.forEach(async (res) => {
          ctrFiles++;
          await res.getMetadata().then(async (metadata) => {
            await res.getDownloadURL().then(async (url) => {
              var obj = {
                key: metadata.fullPath.replace(
                  this.state.subjectId + '/correcciones/',
                  ''
                ),
                modified: Moment(metadata.updated),
                size: metadata.size,
                url: url,
              };

              arrayFiles.push(obj);

              if (ctrFiles === result.items.length) {
                this.setState((state) => ({
                  files: state.files.concat(arrayFiles),
                }));
                arrayFiles = [];
              }

              console.log(this.state.files);
            });
          });
        });
      });
    } catch (error) {
      console.log('Error getting documents of Correciones', error);
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  }

  handleDownloadFile = (fileKeys) => {
    fileKeys.forEach((fileKey) => {
      const file = this.state.files.find((i) => i.key === fileKey);
      window.open(file.url, '_blank'); //to open new page
    });
  };

  render() {
    const { isLoading, files } = this.state;
    return (
      <Fragment>
        {isLoading ? <div id="cover-spin"></div> : <span></span>}

        <Row>
          <Colxx xxs="12">
            <h1>
              <IntlMessages id="menu.my-corrections" />
            </h1>
            <Separator className="mb-5" />
          </Colxx>
        </Row>

        <div className="demo-mount-nested-editable">
          <FileBrowser
            files={files}
            icons={Icons.FontAwesome(4)}
            detailRenderer={() => null}
            onDownloadFile={this.handleDownloadFile}
          />
        </div>
      </Fragment>
    );
  }
}

const mount = document.querySelectorAll('div.demo-mount-nested-editable');
export default injectIntl(Correcciones, mount[0]);
