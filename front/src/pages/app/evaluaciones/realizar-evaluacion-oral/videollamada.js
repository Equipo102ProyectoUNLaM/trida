import React, { useEffect, Fragment, useState } from 'react';
import { useJitsi } from 'react-jutsu'; // Custom hook
import { Button, Row } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { getTimestamp } from 'helpers/Utils';
import { injectIntl } from 'react-intl';
import ROLES from 'constants/roles';
import INTERFACE_CONFIG from 'constants/videollamada';

const Videollamada = ({
  roomName,
  subject = 'Clase Virtual',
  userName,
  password,
  options,
  isHost,
  rol,
}) => {
  const { microfono, camara } = options;
  const parentNode = 'jitsi-container';
  const [shareButtonText, setShareScreenButtonText] = useState(
    'Compartir pantalla'
  );
  const pizarronURI = '/pizarron';

  const setElementHeight = () => {
    const element = document.querySelector(`#${parentNode}`);
    if (element) {
      element.style.height = '85vh';
    }
  };

  const toggleShareScreen = () => {
    if (jitsi) {
      jitsi.executeCommand('toggleShareScreen');
    }
  };

  const abrirPizarron = () => {
    const strWindowFeatures = 'location=yes, scrollbars=yes, status=yes';
    window.open(pizarronURI, '_blank', strWindowFeatures);
  };

  useEffect(() => {
    setElementHeight();
    window.addEventListener('resize', setElementHeight);
    return () => {
      window.removeEventListener('resize', setElementHeight);
    };
  }, []);

  const jitsi = useJitsi({
    roomName,
    parentNode,
    interfaceConfigOverwrite:
      rol === ROLES.Docente
        ? INTERFACE_CONFIG.DOCENTE
        : INTERFACE_CONFIG.ALUMNO,
    configOverwrite: {
      disableDeepLinking: true,
      startWithAudioMuted: microfono,
      startWithVideoMuted: camara,
      defaultLanguage: 'es',
      disableRemoteMute: true,
      disableRemoteControl: true,
      remoteVideoMenu: { disableKick: { isHost } },
      prejoinPageEnabled: false,
    },
  });

  useEffect(() => {
    if (jitsi) {
      jitsi.executeCommand('displayName', userName);
      jitsi.addEventListener('videoConferenceJoined', () => {
        jitsi.executeCommand('displayName', userName);
        jitsi.executeCommand('subject', subject);
        //jitsi.executeCommand('password', password);
      });
      if (rol === ROLES.Docente) {
        jitsi.addEventListener('screenSharingStatusChanged', ({ on }) => {
          on
            ? setShareScreenButtonText('Dejar de Compartir pantalla')
            : setShareScreenButtonText('Compartir pantalla');
        });
      }
    }
    return () => {
      jitsi && jitsi.dispose();
    };
  }, [jitsi, userName, password, subject]);

  return (
    <Fragment>
      <Row className="button-group mb-3 mr-3">
        {rol === ROLES.Docente && (
          <>
            <Button
              className="button"
              color="primary"
              size="lg"
              onClick={toggleShareScreen}
            >
              {shareButtonText}
            </Button>{' '}
            <Button
              className="button"
              color="primary"
              size="lg"
              onClick={abrirPizarron}
            >
              <IntlMessages id="pizarron.abrir-pizarron" />
            </Button>
          </>
        )}
      </Row>
      <div id={parentNode}></div>
    </Fragment>
  );
};

export default injectIntl(Videollamada);
