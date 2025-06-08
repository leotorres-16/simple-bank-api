import { Currency } from "./Account";

export interface Transaction {
  userId: string;
  accountNumber: string;
  amount: number;
  currency: Currency;
  type: TransactionType;
  createdTimestamp: string;
  updatedTimestamp: string;
}

export enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal",
}
