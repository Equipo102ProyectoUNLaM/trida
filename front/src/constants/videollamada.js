/* 'microphone', 'camera', 'closedcaptions', 'desktop', 'embedmeeting', 'fullscreen',
        'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
        'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security' */
// const TOOLBAR_BUTTONS = ['microphone', 'camera', 'shortcuts', 'videoquality', 'fullscreen', 'hangup', 'tileview'];

const INTERFACE_CONFIG = {
  DOCENTE: {
    CLOSE_PAGE_GUEST_HINT: false,
    DISPLAY_WELCOME_PAGE_CONTENT: false,
    DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
    MOBILE_APP_PROMO: false,
    SETTINGS_SECTIONS: ['devices', 'language', 'profile', 'moderator'],
    SHOW_BRAND_WATERMARK: false,
    SHOW_CHROME_EXTENSION_BANNER: false,
    SHOW_JITSI_WATERMARK: false,
    SHOW_POWERED_BY: false,
    SHOW_PROMOTIONAL_CLOSE_PAGE: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    TOOLBAR_ALWAYS_VISIBLE: true,
    TOOLBAR_BUTTONS: [
      'microphone',
      'camera',
      'hangup',
      'raisehand',
      'recording',
      'settings',
      'tileview',
      'desktop',
      'sharedvideo',
      'shortcuts',
      'mute-everyone',
      'videobackgroundblur',
      'download',
    ],
  },
  ALUMNO: {
    CLOSE_PAGE_GUEST_HINT: false,
    DISPLAY_WELCOME_PAGE_CONTENT: false,
    DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
    MOBILE_APP_PROMO: false,
    SETTINGS_SECTIONS: ['devices', 'language', 'profile'],
    SHOW_BRAND_WATERMARK: false,
    SHOW_CHROME_EXTENSION_BANNER: false,
    SHOW_JITSI_WATERMARK: false,
    SHOW_POWERED_BY: false,
    SHOW_PROMOTIONAL_CLOSE_PAGE: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    TOOLBAR_ALWAYS_VISIBLE: true,
    TOOLBAR_BUTTONS: [
      'microphone',
      'camera',
      'hangup',
      'raisehand',
      'settings',
      'tileview',
      'desktop',
      'shortcuts',
      'videobackgroundblur',
    ],
  },
};

export default INTERFACE_CONFIG;
