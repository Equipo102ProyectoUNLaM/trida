import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Row,
  CustomInput,
  Label,
} from 'reactstrap';
import Select from 'react-select';
import TagsInput from 'react-tagsinput';
import IntlMessages from 'helpers/IntlMessages';
import TooltipItem from 'components/common/TooltipItem';
import {
  enviarNotificacionExitosa,
  enviarNotificacionError,
} from 'helpers/Utils-ui';
import { registerUser } from 'redux/actions';
import { connect } from 'react-redux';
import 'react-tagsinput/react-tagsinput.css';
import { getCourses } from 'helpers/Firebase-user';
import { isEmpty } from 'helpers/Utils';
import { toolTipMails } from 'constants/texts';

class ModalAsignacionMateria extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
      items: [],
      isLoading: true,
      showCourses: false,
      showSubjects: false,
      instId: '',
      courseId: '',
      courses: [],
      subjects: [],
      instOptions: [
        {
          label: this.props.institution.name,
          value: this.props.institution.name,
          key: this.props.institution.id,
        },
      ],
      courseOptions: [],
      subjectOptions: [],
      selectedCourse: '',
      selectedOption: '',
      selectedSubject: '',
      userId: '',
      alumnosCheck: false,
    };
  }

  componentDidMount() {
    const { instOptions } = this.state;
    const [instOpt] = instOptions;
    this.showCourses(instOpt.key);
    this.setState({
      isLoading: false,
    });
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.error && this.props.error) {
      enviarNotificacionError(this.props.error, 'Error de registro');
      this.setState({ isLoading: false });
    }
  }

  async getUserCourses(institutionId, userId) {
    let array = [];
    let datos = [];
    try {
      array = await getCourses(institutionId, userId);
      array.map((item) => {
        datos.push({
          label: item.name,
          value: item.name,
          key: item.id,
        });
      });
      this.setState({
        courseOptions: datos,
      });
    } catch (err) {
      enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
    } finally {
      this.setState({
        isLoading: false,
        courses: array,
      });
    }
  }

  showCourses = (institutionId) => {
    this.setState({
      showCourses: true,
      showSubjects: false,
      isLoading: true,
      courses: [],
      subjects: [],
      instId: institutionId,
    });
    this.getUserCourses(institutionId, this.props.user);
  };

  showSubjects = (courseId) => {
    let datos = [];
    const [array] = this.state.courses;
    array.subjects.map((item) => {
      datos.push({
        label: item.name,
        value: item.name,
        key: item.id,
      });
    });
    this.setState({
      showSubjects: true,
      subjects: array.subjects,
      subjectOptions: datos,
      courseId,
    });
  };

  onConfirm = async () => {
    const { tags } = this.state;
    for (const tag in tags) {
      const userObj = {
        email: tags[tag],
        instId: this.state.selectedOption.key,
        courseId: this.state.selectedCourse.key,
        subjectId: this.state.selectedSubject.key,
      };
      try {
        this.setState({ isLoading: true });
        await this.props.registerUser(userObj);
        if (isEmpty(this.props.error)) {
          this.registroExitoso();
        }
      } catch (error) {
        enviarNotificacionError(
          'Hubo un error al enviar la invitación',
          'Error'
        );
      }
    }
  };

  registroExitoso = async () => {
    this.setState({ isLoading: false });
    this.props.toggle();
    enviarNotificacionExitosa(
      'Invitación enviada exitosamente',
      'Invitación enviada!'
    );
  };

  handleTagChange = (tags) => {
    this.setState({ tags });
  };

  handleCourseChange = (selectedCourse) => {
    if (selectedCourse) {
      this.setState({ selectedCourse });
      this.showSubjects(selectedCourse.key);
    } else {
      this.setState({
        selectedCourse: '',
        selectedSubject: '',
        showSubjects: false,
      });
    }
  };

  handleSubjectChange = (selectedSubject) => {
    if (selectedSubject) {
      this.setState({ selectedSubject });
    } else {
      this.setState({
        selectedSubject: '',
      });
    }
  };

  render() {
    const { isOpen, toggle } = this.props;
    const {
      instOptions,
      showCourses,
      showSubjects,
      courseOptions,
      selectedCourse,
      subjectOptions,
      selectedSubject,
      isLoading,
    } = this.state;
    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Asignar Materias</ModalHeader>
        <ModalBody>
          <Row>
            <div className="form-group has-float-label with-tooltip">
              <Select
                className="react-select"
                classNamePrefix="select"
                isClearable={false}
                name="institucion"
                options={instOptions}
                value={instOptions}
                isDisabled
              />
              <IntlMessages id="institucion.nombre" />
            </div>
          </Row>
          {showCourses && (
            <Row>
              <div className="form-group has-float-label with-tooltip">
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  isClearable={true}
                  name="curso"
                  options={courseOptions}
                  value={selectedCourse}
                  onChange={this.handleCourseChange}
                  isDisabled={false}
                  placeholder="Seleccionar curso..."
                />
                <IntlMessages id="user.asignacion-curso" />
              </div>
            </Row>
          )}
          {showSubjects && (
            <Row>
              <div className="form-group has-float-label with-tooltip">
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  isClearable={true}
                  name="materia"
                  options={subjectOptions}
                  value={selectedSubject}
                  onChange={this.handleSubjectChange}
                  isDisabled={false}
                  placeholder="Seleccionar materia..."
                />
                <IntlMessages id="user.asignacion-materia" />
              </div>
            </Row>
          )}
          <Form>
            <Row>
              <div className="form-group has-float-label with-tooltip">
                <TagsInput
                  value={this.state.tags}
                  onChange={this.handleTagChange}
                  inputProps={{
                    placeholder: '',
                  }}
                />
                <IntlMessages id="user.mail-invitado" />
              </div>
              <TooltipItem body={toolTipMails} id="mails" />
            </Row>
          </Form>
          <p className="tip-text">* campos requeridos</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            size="sm"
            onClick={this.onConfirm}
            disabled={isEmpty(this.state.tags)}
          >
            Confirmar
          </Button>
          <Button color="secondary" size="sm" onClick={toggle}>
            Cancelar
          </Button>
        </ModalFooter>
        {isLoading && <div className="cover-spin" />}
      </Modal>
    );
  }
}

const mapStateToProps = ({ authUser, seleccionCurso }) => {
  const { user, error } = authUser;
  const { institution } = seleccionCurso;

  return {
    user,
    error,
    institution,
  };
};

export default connect(mapStateToProps, {
  registerUser,
})(ModalAsignacionMateria);
