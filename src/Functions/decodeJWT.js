export const decodeJWT = (token) => {
  if (!token) {
    throw new Error('No JWT token provided');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT token format');
  }

  const encodedPayload = parts[1];
  const decodedPayload = atob(encodedPayload);
  const decodedUnicodePayload = decodeURIComponent(Array.prototype.map.call(decodedPayload, function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(decodedUnicodePayload);
};
