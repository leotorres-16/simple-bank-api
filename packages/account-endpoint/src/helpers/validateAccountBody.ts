import { AccountType } from "shared/index";

export const validateAccountBody = (body: any): boolean => {
  if (body.name === undefined || body.name === null || body.accountType === undefined || body.accountType === null) {
    return false;
  }

  if (!Object.values(AccountType).includes(body.accountType)) {
    return false;
  }

  return true;
};
