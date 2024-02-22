export const encodeBase64 = (data: string) => {
  return btoa(data);
};

export const decodeBase64 = (data: string) => {
  return atob(data);
};

export const generatePassword = () => {
  var length = 10,
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    retVal = '';
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};
