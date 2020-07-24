import React, { useEffect, Fragment, useState } from 'react';
import { useJitsi } from 'react-jutsu'; // Custom hook
import { Button } from 'reactstrap';

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
  const abrirPizarronTxt = 'Abrir pizarrón';
  const pizarronURI = '/app/clases-virtuales/pizarron';

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
    window.open(pizarronURI);
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
      <Button
        className="btn"
        color="primary"
        size="lg"
        onClick={toggleShareScreen}
      >
        {shareButtonText}
      </Button>{' '}
      <Button className="btn" color="primary" size="lg" onClick={abrirPizarron}>
        {abrirPizarronTxt}
      </Button>{' '}
      <div id={parentNode}></div>
    </Fragment>
  );
};

export default Videollamada;
