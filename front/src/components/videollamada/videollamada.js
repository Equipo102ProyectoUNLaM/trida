import React, { useEffect } from 'react';
import { useJitsi } from 'react-jutsu'; // Custom hook
/* 'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
        'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
        'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security' */
// const TOOLBAR_BUTTONS = ['microphone', 'camera', 'shortcuts', 'videoquality', 'fullscreen', 'hangup', 'tileview'];

const Videollamada = ({ roomName, subject = 'Clase Virtual', userName }) => {
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
        'mute-everyone',
        'hangup',
        'raisehand',
        'recording',
      ],
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
      TOOLBAR_ALWAYS_VISIBLE: true,
    },
    configOverwrite: {
      disableDeepLinking: true,
      startAudioMuted: 1,
      startVideoMuted: 1,
    },
  });

  useEffect(() => {
    if (jitsi) {
      jitsi.addEventListener('videoConferenceJoined', () => {
        jitsi.executeCommand('displayName', userName);
        jitsi.executeCommand('subject', subject);
      });
    }
    return () => jitsi && jitsi.dispose();
  }, [jitsi, userName, subject]);
  return <div id={parentNode}></div>;
};

export default Videollamada;
