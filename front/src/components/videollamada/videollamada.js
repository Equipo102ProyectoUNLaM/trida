import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useJitsi } from 'react-jutsu'; // Custom hook
const CLASES_URL = '/app/virtual-classes/my-classes';
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
  history,
  isHost,
}) => {
  const { microfono, camara } = options;
  const parentNode = 'jitsi-container';

  const setElementHeight = () => {
    const element = document.querySelector(`#${parentNode}`);
    if (element) {
      element.style.height = '85vh';
    }
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
        history.push(CLASES_URL);
      });
    }
    return () => jitsi && jitsi.dispose();
  }, [jitsi, userName, password, subject]);
  return <div id={parentNode}></div>;
};

export default withRouter(Videollamada);
