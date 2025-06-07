import { Account, AccountType, Currency, User } from "shared/index";

export const fetchAccounts = async (userId: string): Promise<Account[] | null> => {
  // Simulate fetching user data from a database or external service
  return [
    {
      userId: "usr-123",
      accountNumber: "12345678",
      sortCode: "10-10-10",
      name: "test account",
      accountType: AccountType.PERSONAL,
      balance: 0,
      currency: Currency.GBP,
      createdTimestamp: new Date().toISOString(),
      updatedTimestamp: new Date().toISOString(),
    },
    {
      userId: "usr-123",
      accountNumber: "87654321",
      sortCode: "10-10-10",
      name: "test account",
      accountType: AccountType.PERSONAL,
      balance: 0,
      currency: Currency.GBP,
      createdTimestamp: new Date().toISOString(),
      updatedTimestamp: new Date().toISOString(),
    },
  ];
};

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

export const createAccount = async (name: string, type: AccountType): Promise<Account | null> => {
  // Simulate creating a user in a database or external service
  return {
    userId: "usr-123",
    accountNumber: "12345678",
    sortCode: "10-10-10",
    name: name,
    accountType: type,
    balance: 0,
    currency: Currency.GBP,
    createdTimestamp: new Date().toISOString(),
    updatedTimestamp: new Date().toISOString(),
  };
};

export const deleteAccount = async (userId: string): Promise<boolean> => {
  // Simulate deleting a user from a database or external service
  console.log("User deleted:", userId);
  return true; // Return null to indicate the user was deleted
};

export const updateAccountDetails = async (account: Account): Promise<boolean> => {
  // Simulate updating a user in a database or external service
  console.log("Account updated:", account);
  return true; // Return null to indicate the user was updated
};
