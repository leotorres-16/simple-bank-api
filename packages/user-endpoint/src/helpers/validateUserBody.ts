export const validateUserBody = (body: any): boolean => {
  if (
    body.name === undefined ||
    body.name === null ||
    body.address === undefined ||
    body.address === null ||
    body.address.line1 === undefined ||
    body.address.line1 === null ||
    body.address.town === undefined ||
    body.address.town === null ||
    body.address.county === undefined ||
    body.address.county === null ||
    body.address.postcode === undefined ||
    body.address.postcode === null ||
    body.phoneNumber === undefined ||
    body.phoneNumber === null ||
    body.email === undefined ||
    body.email === null
  ) {
    return false;
  }

  // This Regex did not work for me: ^+[1-9]d{1,14}$. Using the one form this article: https://stackabuse.com/validate-phone-numbers-in-javascript-with-regular-expressions/
  const pattern = new RegExp("^\\+[1-9]{1}[0-9]{0,2}-[2-9]{1}[0-9]{2}-[2-9]{1}[0-9]{2}-[0-9]{4}$");
  if (!pattern.test(body.phoneNumber)) {
    return false;
  }

  const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  if (!emailRegex.test(body.email)) {
    return false;
  }

  return true;
};
