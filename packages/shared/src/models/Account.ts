export interface Account {
  userId: string;
  accountNumber: string;
  sortCode: string;
  name: string;
  accountType: AccountType;
  balance: number;
  currency: Currency;
  createdTimestamp: string;
  updatedTimestamp: string;
}

export enum AccountType {
  PERSONAL = "personal",
}

export enum Currency {
  GBP = "GBP",
}
