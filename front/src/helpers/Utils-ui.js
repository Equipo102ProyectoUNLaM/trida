import { NotificationManager } from 'components/common/react-notifications';

export const enviarNotificacionExitosa = (mensaje, titulo) => {
  NotificationManager.success(`${mensaje}`, `${titulo}`, 3000, null, null, '');
};
