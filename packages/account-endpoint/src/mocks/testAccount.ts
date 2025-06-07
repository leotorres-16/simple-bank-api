import { AccountType, Currency } from "shared/index";

export const testAccount = {
  userId: "usr-123",
  accountNumber: "12345678",
  sortCode: "10-10-10",
  name: "Test Account",
  accountType: AccountType.PERSONAL,
  balance: 0,
  currency: Currency.GBP,
  createdTimestamp: new Date().toISOString(),
  updatedTimestamp: new Date().toISOString(),
};

export const testAccountForUpdate = {
  userId: "usr-123",
  accountNumber: "12345678",
  sortCode: "10-10-10",
  name: "Test Account",
  accountType: AccountType.PERSONAL,
  balance: 0,
  currency: Currency.GBP,
  createdTimestamp: "2025-01-01T00:00:00.000Z",
  updatedTimestamp: new Date().toISOString(),
};
