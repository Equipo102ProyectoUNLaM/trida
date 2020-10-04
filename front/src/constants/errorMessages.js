export const authErrorMessage = (error) => {
  switch (error) {
    case 'The email address is already in use by another account.':
      return 'Este correo ya está siendo usado por otro usuario.';
    case 'There is no user record corresponding to this identifier. The user may have been deleted.':
      return 'El mail ingresado no corresponde a un usuario registrado.';
    case 'The password is invalid or the user does not have a password.':
      return 'El password es inválido o el usuario no tiene password registrado';
    default:
      return error;
  }
};
