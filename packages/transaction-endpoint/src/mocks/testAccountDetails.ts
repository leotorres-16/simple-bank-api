import { AccountType, Currency } from "shared/index";

export const testAccountDetails = {
  userId: "usr-123",
  accountNumber: "123456",
  sortCode: "10-10-10",
  name: "test account",
  accountType: AccountType.PERSONAL,
  balance: 100,
  currency: Currency.GBP,
  createdTimestamp: "2025-01-01T00:00:00.000Z",
  updatedTimestamp: "2025-01-01T00:00:00.000Z",
};
