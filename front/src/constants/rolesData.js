export const rolesData = (rol) => {
  switch (rol) {
    case 1:
      return { rolTexto: 'Docente', icon: 'iconsminds-male-female' };
    case 2:
      return { rolTexto: 'Alumno', icon: 'iconsminds-student-male-female' };
    case 3:
      return { rolTexto: 'Directivo', icon: 'iconsminds-male-female' };
    default:
      return rol;
  }
};

export const rolesSelect = [
  { label: 'Docentes', value: 'Docentes', key: 1 },
  { label: 'Alumnos', value: 'Alumnos', key: 2 },
  { label: 'Directivos', value: 'Directivos', key: 3 },
];
