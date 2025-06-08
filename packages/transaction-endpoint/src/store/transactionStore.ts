import { Account, AccountType, Currency, Transaction, User } from "shared/index";

export const fetchAccountDetails = async (accountNumber: string): Promise<Account | null> => {
  // Simulate creating a user in a database or external service
  return {
    userId: "usr-123",
    accountNumber: accountNumber,
    sortCode: "10-10-10",
    name: "test account",
    accountType: AccountType.PERSONAL,
    balance: 0,
    currency: Currency.GBP,
    createdTimestamp: new Date().toISOString(),
    updatedTimestamp: new Date().toISOString(),
  };
};

export const createTransaction = async (transaction: Transaction): Promise<boolean> => {
  // Simulate creating a user in a database or external service
  return true;
};

export const fetchTransactionsForAccount = async (accountNumber: string): Promise<Transaction[]> => {
  return [];
};
