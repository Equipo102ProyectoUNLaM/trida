import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { connect } from 'react-redux';
import { Input, ModalFooter, Button, FormGroup, Label } from 'reactstrap';
import Switch from 'rc-switch';
import { createUUID } from 'helpers/Utils';
import { editDocument, addDocument } from 'helpers/Firebase-db';
import * as CryptoJS from 'crypto-js';
import { secretKey } from 'constants/defaultValues';
import { capitalizeString } from 'helpers/Utils';

const FormClase = ({
  toggleModal,
  onClaseGuardada,
  subject,
  user,
  idClase,
  nombre,
  fecha,
  descripcion,
  sala,
}) => {
  const { handleSubmit, errors, control } = useForm();
  const [switchVideollamada, setSwitchVideollamada] = useState(sala);

  const onSubmit = async (values) => {
    let idSala = '';
    const { nombre, fecha, descripcion } = values;
    if (switchVideollamada) {
      const uuid = createUUID();
      idSala = CryptoJS.AES.encrypt(uuid, secretKey).toString();
    }
    const obj = {
      nombre: capitalizeString(nombre),
      fecha,
      descripcion,
      idSala,
      idMateria: subject.id,
      contenidos: [],
    };

    if (idClase) {
      await editDocument(
        'clases',
        idClase,
        obj,
        'Clase',
        'Clase',
        'Error al guardar la clase'
      );
    } else {
      await addDocument(
        'clases',
        obj,
        user,
        'Clase agregada',
        'Clase agregada exitosamente',
        'Error al agregar la clase'
      );
    }

    onClaseGuardada();
  };

  return (
    <form
      className="av-tooltip tooltip-label-right"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormGroup className="mb-3 error-l-150">
        <Label>Nombre de la clase</Label>
        <Controller
          as={Input}
          control={control}
          name="nombre"
          defaultValue={nombre || ''}
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

      <FormGroup className="mb-3 error-l-150">
        <Label>Fecha</Label>
        <Controller
          as={Input}
          control={control}
          name="fecha"
          defaultValue={fecha || ''}
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

      <FormGroup className="mb-3 error-l-150">
        <Label>Descripción</Label>
        <Controller
          as={Input}
          control={control}
          name="descripcion"
          defaultValue={descripcion || ''}
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

      <FormGroup className="form-check-switch">
        <Label>¿Esta clase tendrá videollamada?</Label>
        <Switch
          checked={switchVideollamada}
          id="Tooltip-Switch"
          className="custom-switch custom-switch-primary"
          onChange={(value) => {
            setSwitchVideollamada(value);
          }}
          checkedChildren="Si"
          unCheckedChildren="No"
        />
      </FormGroup>
      <ModalFooter className="card-notas">
        <Button color="primary" type="submit">
          {idClase ? 'Editar' : 'Agregar'}
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
