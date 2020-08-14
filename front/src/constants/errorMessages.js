export const authErrorMessage = (error) => {
  switch (error) {
    case 'The email address is already in use by another account.':
      return 'Este correo ya está siendo usado por otro usuario.';
    case 'There is no user record corresponding to this identifier. The user may have been deleted.':
      return 'El mail ingresado no corresponde a un usuario registrado.';
    default:
      return error;
  }
};
