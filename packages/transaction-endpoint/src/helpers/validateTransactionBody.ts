import { Currency, TransactionType } from "shared/index";

export const validateTransactionBody = (body: any): boolean => {
  if (body.amount === undefined || body.amount === null || body.currency === undefined || body.currency === null || body.type === undefined || body.type === null) {
    return false;
  }

  if (!Object.values(Currency).includes(body.currency)) {
    return false;
  }

  if (!Object.values(TransactionType).includes(body.type)) {
    return false;
  }

  if (body.amount < 0 || body.amount > 10000) {
    return false;
  }

  return true;
};
