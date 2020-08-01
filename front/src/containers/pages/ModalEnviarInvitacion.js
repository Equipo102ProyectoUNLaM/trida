import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
} from 'reactstrap';
import TagsInput from 'react-tagsinput';
import IntlMessages from 'helpers/IntlMessages';
import { enviarNotificacionExitosa } from 'helpers/Utils-ui';
import { registerUser } from 'redux/actions';
import { connect } from 'react-redux';
import 'react-tagsinput/react-tagsinput.css';
import { getInstitucionesDeUsuario } from 'helpers/Firebase-user';

class ModalEnviarInvitacion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalInvitacionOpen: false,
      tags: [],
      userId: localStorage.getItem('user_id'),
      items: [],
      arrayCursos: [],
      isLoading: true,
      isEmpty: false,
    };
  }

  componentDidMount() {
    this.getInstituciones(this.state.userId);
  }

  /*getInstituciones = async (userId) => {
    try {
      const inst = await getInstitucionesDeUsuario(userId);
      this.dataListRenderer(inst);
    } catch (err) {
      console.log('Error', err);
    }
  };

  dataListRenderer(array) {
    this.setState({
      items: array,
      isLoading: false,
      isEmpty: !array.length,
    });
  }

  async getUserCourses(institutionId) {
    var array = [];
    try {
      const userRef = firestore.doc(`users/${userId}`);
      var userDoc = await userRef.get();
      const { instituciones } = userDoc.data(); //Traigo las instituciones del usuario
      var instf = instituciones.filter(
        (i) => i.institucion_id.id === institutionId
      ); //Busco la que seleccionó anteriormente
      for (const c of instf[0].cursos) {
        //Itero en sus cursos, me traigo toda la info del documento
        const courseRef = firestore.doc(`${c.curso_id.path}`);
        var courseDoc = await courseRef.get();
        const { nombre } = courseDoc.data();
        var subjects_with_data = await this.renderSubjects(c.materias); //Busco las materias que tiene asignadas
        const obj = {
          id: c.curso_id.id,
          subjects: subjects_with_data,
          name: nombre,
        };
        array.push(obj); //Armo el array con la info del curso y las materias
      }
      return array;
    } catch (err) {
      console.log('Error getting documents', err);
    }
  }

  async renderSubjects(materiasIds) {
    const array = [];
    try {
      for (const m of materiasIds) {
        //Busco los documentos de las materias y me traigo la info
        const matRef = firestore.doc(`${m.path}`);
        var matDoc = await matRef.get();
        const { nombre } = matDoc.data();
        const obj = {
          id: m.id,
          name: nombre,
        };
        array.push(obj);
      }
      return array;
    } catch (err) {
      console.log('Error getting documents', err);
    }
  }*/

  onConfirm = async () => {
    const userObj = {
      email: this.state.tags[0],
      password: '123456',
      isInvited: true,
    };
    //agarrar los mails de los tags, autogenerar contraseña para cada uno
    // crear usuarios con todo vacío menos el curso del cual se lo esta invitando y mandar mail de invitación
    try {
      await this.props.registerUser(userObj, this.props.history);
    } catch (error) {
      console.log(error);
    } finally {
      this.registroExitoso();
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

  render() {
    const { isOpen, toggle } = this.props;
    console.log(this.state.items);
    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Enviar Invitación</ModalHeader>
        <ModalBody>
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
