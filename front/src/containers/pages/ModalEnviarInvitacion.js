import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
} from 'reactstrap';
import Select from 'react-select';
import TagsInput from 'react-tagsinput';
import IntlMessages from 'helpers/IntlMessages';
import {
  enviarNotificacionExitosa,
  enviarNotificacionError,
} from 'helpers/Utils-ui';
import { registerUser } from 'redux/actions';
import { connect } from 'react-redux';
import 'react-tagsinput/react-tagsinput.css';
import {
  getInstituciones,
  getCourses,
  asignarMateriasAUsuario,
} from 'helpers/Firebase-user';

class ModalEnviarInvitacion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalInvitacionOpen: false,
      tags: [],
      userId: localStorage.getItem('user_id'),
      items: [],
      isLoading: true,
      showCourses: false,
      showSubjects: false,
      instId: '',
      courseId: '',
      courses: [],
      subjects: [],
      instOptions: [],
      courseOptions: [],
      subjectOptions: [],
      selectedCourse: '',
      selectedOption: '',
      selectedSubject: '',
    };
  }

  componentDidMount() {
    this.getInstituciones(this.state.userId);
  }

  getInstituciones = async (userId) => {
    try {
      let datos = [];
      const inst = await getInstituciones(userId);
      this.setState({
        items: inst,
        isLoading: false,
      });
      inst.map((item) => {
        datos.push({
          label: item.name,
          value: item.name,
          key: item.id,
        });
      });
      this.setState({
        instOptions: datos,
      });
    } catch (err) {
      console.log('Error', err);
    }
  };

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
      console.log('Error getting documents', err);
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
    this.getUserCourses(institutionId, this.state.userId);
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
    const userObj = {
      email: this.state.tags[0],
      password: '123456',
      isInvited: true,
      instId: this.state.selectedOption.key,
      courseId: this.state.selectedCourse.key,
      subjectId: this.state.selectedSubject.key,
    };
    //agarrar los mails de los tags, autogenerar contraseña para cada uno
    try {
      await this.props.registerUser(userObj, this.props.history);
      // validar que no haya error de registro
      this.registroExitoso();
    } catch (error) {
      enviarNotificacionError('Hubo un error al enviar la invitación', 'Error');
      this.props.toggle();
    }
  };

  registroExitoso = async () => {
    this.props.toggle();
    enviarNotificacionExitosa(
      'Invitación enviada exitosamente',
      'Invitación enviada!'
    );
  };

  handleTagChange = (tags) => {
    this.setState({ tags });
  };

  handleInstChange = (selectedOption) => {
    if (selectedOption) {
      this.setState({ selectedOption });
      this.showCourses(selectedOption.key);
    } else {
      this.setState({
        selectedOption: '',
        selectedCourse: '',
        selectedSubject: '',
        showCourses: false,
        showSubjects: false,
      });
    }
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
      selectedOption,
      showCourses,
      showSubjects,
      courseOptions,
      selectedCourse,
      subjectOptions,
      selectedSubject,
    } = this.state;
    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Enviar Invitación</ModalHeader>
        <ModalBody>
          <div className="form-group has-float-label">
            <Select
              className="react-select"
              classNamePrefix="select"
              isClearable={true}
              name="institucion"
              options={instOptions}
              value={selectedOption}
              onChange={this.handleInstChange}
            />
            <IntlMessages id="user.seleccion-institucion" />
          </div>
          {showCourses && (
            <div className="form-group has-float-label">
              <Select
                className="react-select"
                classNamePrefix="select"
                isClearable={true}
                name="curso"
                options={courseOptions}
                value={selectedCourse}
                onChange={this.handleCourseChange}
                isDisabled={false}
              />
              <IntlMessages id="user.seleccion-curso" />
            </div>
          )}
          {showSubjects && (
            <div className="form-group has-float-label">
              <Select
                className="react-select"
                classNamePrefix="select"
                isClearable={true}
                name="materia"
                options={subjectOptions}
                value={selectedSubject}
                onChange={this.handleSubjectChange}
                isDisabled={false}
              />
              <IntlMessages id="user.seleccion-materia" />
            </div>
          )}
          <p className="tip-text">
            Ingresá el email del usuario al que querés invitar. <br /> Presioná
            &quot;Enter&quot; por cada mail que ingreses.
          </p>
          <Form>
            <div className="form-group has-float-label">
              <TagsInput
                value={this.state.tags}
                onChange={this.handleTagChange}
                inputProps={{
                  placeholder: '',
                }}
              />
              <IntlMessages id="user.mail-invitado" />
            </div>
          </Form>
          <p className="tip-text">* campos requeridos</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" size="sm" onClick={this.onConfirm}>
            Confirmar
          </Button>
          <Button color="secondary" size="sm" onClick={toggle}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default connect(null, {
  registerUser,
})(ModalEnviarInvitacion);
