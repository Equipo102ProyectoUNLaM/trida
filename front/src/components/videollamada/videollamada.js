import React, { useEffect, Fragment, useState } from 'react';
import { useJitsi } from 'react-jutsu'; // Custom hook
import { Button, Row } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { injectIntl } from 'react-intl';

/* 'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
        'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
        'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security' */
// const TOOLBAR_BUTTONS = ['microphone', 'camera', 'shortcuts', 'videoquality', 'fullscreen', 'hangup', 'tileview'];

const Videollamada = ({
  roomName,
  subject = 'Clase Virtual',
  userName,
  password,
  options,
  isHost,
  setCallOff,
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
    interfaceConfigOverwrite: {
      TOOLBAR_BUTTONS: [
        'microphone',
        'camera',
        'hangup',
        'raisehand',
        'recording',
        'settings',
        'tileview',
        'desktop',
        'chat',
        'sharedvideo',
        'shortcuts',
        'mute-everyone',
        'videobackgroundblur',
      ],
      SETTINGS_SECTIONS: ['devices', 'language', 'profile'],
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
      TOOLBAR_ALWAYS_VISIBLE: true,
      DEFAULT_LOCAL_DISPLAY_NAME: userName,
    },
    configOverwrite: {
      disableDeepLinking: true,
      startWithAudioMuted: microfono,
      startWithVideoMuted: camara,
      defaultLanguage: 'es',
      disableRemoteMute: true,
      disableRemoteControl: true,
      remoteVideoMenu: { disableKick: { isHost } },
    },
  });

  useEffect(() => {
    if (jitsi) {
      jitsi.addEventListener('videoConferenceJoined', () => {
        jitsi.executeCommand('displayName', userName);
        jitsi.executeCommand('subject', subject);
        jitsi.executeCommand('password', password);
      });
      jitsi.addEventListener('readyToClose', () => {
        setCallOff();
      });
      jitsi.addEventListener('screenSharingStatusChanged', ({ on }) => {
        on
          ? setShareScreenButtonText('Dejar de Compartir pantalla')
          : setShareScreenButtonText('Compartir pantalla');
      });
    }
    return () => {
      jitsi && jitsi.dispose();
    };
  }, [jitsi, userName, password, subject]);
  return (
    <Fragment>
      <Row className="button-group mb-3 mr-3">
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
      </Row>
      <div id={parentNode}></div>
    </Fragment>
  );
};

export default injectIntl(Videollamada);
