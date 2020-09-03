import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { connect } from 'react-redux';
import { Input, ModalFooter, Button, FormGroup, Label } from 'reactstrap';
import Switch from 'rc-switch';
import { createUUID } from 'helpers/Utils';
import { addDocument } from 'helpers/Firebase-db';
import * as CryptoJS from 'crypto-js';
import { secretKey } from 'constants/defaultValues';

const FormClase = ({ toggleModal, onClaseAgregada, subject, user }) => {
  const { handleSubmit, errors, control } = useForm();
  const [switchVideollamada, setSwitchVideollamada] = useState(false);

  const onSubmit = async (values) => {
    let idSala = '';
    const { nombre, fecha, descripcion } = values;

    if (switchVideollamada) {
      const uuid = createUUID();
      idSala = CryptoJS.AES.encrypt(uuid, secretKey).toString();
    }
    const obj = {
      nombre,
      fecha,
      descripcion,
      idSala,
      idMateria: subject.id,
      contenidos: [],
    };
    await addDocument(
      'clases',
      obj,
      user,
      'Clase agregada',
      'Clase agregada exitosamente',
      'Error al agregar la clase'
    );

    onClaseAgregada();
  };

  const generateIdSala = () => {
    this.setState(
      (prevState) => ({
        switchVideollamada: !prevState.switchVideollamada,
      }),
      () => {
        if (this.state.switchVideollamada) {
          const uuid = createUUID();
          const encriptada = CryptoJS.AES.encrypt(uuid, secretKey).toString();
          this.setState({ idSala: encriptada });
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup className="mb-3">
        <Label>Nombre de la clase</Label>
        <Controller
          as={Input}
          control={control}
          name="nombre"
          defaultValue=""
          rules={{
            required: { value: true, message: 'El nombre es requerido' },
          }}
        />
        {errors.nombre && (
          <div className="invalid-feedback d-block">
            {errors.nombre.message}
          </div>
        )}
      </FormGroup>

      <FormGroup className="mb-3">
        <Label>Fecha</Label>
        <Controller
          as={Input}
          control={control}
          name="fecha"
          defaultValue=""
          type="date"
          placeholder="DD/MM/AAAA"
          rules={{
            required: { value: true, message: 'La fecha es requerida' },
          }}
        />
        {errors.fecha && (
          <div className="invalid-feedback d-block">{errors.fecha.message}</div>
        )}
      </FormGroup>

      <FormGroup className="mb-3">
        <Label>Descripción</Label>
        <Controller
          as={Input}
          control={control}
          name="descripcion"
          defaultValue=""
          type="textarea"
          rules={{
            required: { value: true, message: 'La descripción es requerida' },
          }}
        />
        {errors.descripcion && (
          <div className="invalid-feedback d-block">
            {errors.descripcion.message}
          </div>
        )}
      </FormGroup>

      <FormGroup check>
        <Label check>¿Esta clase tendrá videollamada?</Label>
        <Switch
          id="Tooltip-Switch"
          className="custom-switch custom-switch-primary"
          onChange={(value) => {
            setSwitchVideollamada(value);
          }}
          checkedChildren="Si"
          unCheckedChildren="No"
        />
      </FormGroup>
      <ModalFooter>
        <Button color="primary" type="submit">
          Agregar
        </Button>
        <Button color="secondary" onClick={toggleModal}>
          Cancelar
        </Button>
      </ModalFooter>
    </form>
  );
};

const mapStateToProps = ({ authUser, seleccionCurso }) => {
  const { user } = authUser;
  const { subject } = seleccionCurso;
  return { user, subject };
};

export default connect(mapStateToProps)(FormClase);
