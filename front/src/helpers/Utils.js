import { defaultDirection } from '../constants/defaultValues';

export const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;

export const mapOrder = (array, order, key) => {
  array.sort(function (a, b) {
    var A = a[key],
      B = b[key];
    if (order.indexOf(A + '') > order.indexOf(B + '')) {
      return 1;
    } else {
      return -1;
    }
  });
  return array;
};

export const getDateWithFormat = () => {
  const today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  return dd + '.' + mm + '.' + yyyy;
};

export const getCurrentTime = () => {
  const now = new Date();
  return now.getHours() + ':' + now.getMinutes();
};

export const getDirection = () => {
  let direction = defaultDirection;
  if (localStorage.getItem('direction')) {
    const localValue = localStorage.getItem('direction');
    if (localValue === 'rtl' || localValue === 'ltr') {
      direction = localValue;
    }
  }
  return {
    direction,
    isRtl: direction === 'rtl',
  };
};

export const setDirection = (localValue) => {
  let direction = 'ltr';
  if (localValue === 'rtl' || localValue === 'ltr') {
    direction = localValue;
  }
  localStorage.setItem('direction', direction);
};

export const createUUID = () => {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
    c
  ) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });

  return uuid;
};

export const createRandomString = () => {
  return Math.random().toString(36).slice(-8);
};

export const toDateTime = (secs) => {
  var t = new Date(1970, 0, 1);
  t.setSeconds(secs);
  const formattedDate =
    t.getDate() + '-' + (t.getMonth() + 1) + '-' + t.getFullYear();
  return formattedDate;
};
