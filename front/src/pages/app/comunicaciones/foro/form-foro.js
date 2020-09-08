import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { connect } from 'react-redux';
import { Input, ModalFooter, Button, FormGroup, Label } from 'reactstrap';
import { editDocument, addDocument } from 'helpers/Firebase-db';
import { capitalizeString } from 'helpers/Utils';

const FormForo = ({
  toggleModal,
  onForoGuardado,
  subject,
  user,
  idForo,
  nombre,
  descripcion,
}) => {
  const { handleSubmit, errors, control } = useForm();

  const onSubmit = async (values) => {
    const { nombre, descripcion } = values;

    const obj = {
      nombre: capitalizeString(nombre),
      descripcion,
      idMateria: subject.id,
    };

    if (idForo) {
      await editDocument(
        'foros',
        idForo,
        obj,
        'Tema editado',
        'Tema editado',
        'Error al guardar el tema'
      );
    } else {
      await addDocument(
        'foros',
        obj,
        user,
        'Tema agregado',
        'Tema agregado exitosamente',
        'Error al agregar el tema'
      );
    }

    onForoGuardado();
  };

  return (
    <form
      className="av-tooltip tooltip-label-right"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormGroup className="mb-3 error-l-150">
        <Label>Nombre del tema</Label>
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
      <ModalFooter className="card-notas">
        <Button color="primary" type="submit">
          {idForo ? 'Editar' : 'Agregar'}
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

export default connect(mapStateToProps)(FormForo);
