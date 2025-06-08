import { handleCreate } from "./handleCreate";
import { createTransaction, fetchAccountDetails } from "../store/transactionStore";
import { CreateDepositBodyWithAllData, CreateWithdrawalBodyHighWithdrawal, CreateWithdrawalBodyMissingAmount, CreateWithdrawalBodyWithAllData } from "../mocks/createBody";
import { testAccountDetails } from "../mocks/testAccountDetails";

const session = { userId: "usr-123" };

jest.mock("../store/transactionStore");
const mockedCreateTransaction = createTransaction as jest.Mock;
const mockedFetchAccountDetails = fetchAccountDetails as jest.Mock;

jest.useFakeTimers().setSystemTime(new Date("2025-01-01"));

describe("Handle Create - Core Logic", function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("User wants to deposit money into their bank account", async () => {
    const expectedBody = JSON.stringify({
      message: "Transaction has been created successfully",
    });
    const transactionToCreate = {
      userId: "usr-123",
      accountNumber: "123456",
      amount: "100",
      currency: "GBP",
      type: "deposit",
      createdTimestamp: "2025-01-01T00:00:00.000Z",
      updatedTimestamp: "2025-01-01T00:00:00.000Z",
    };
    mockedFetchAccountDetails.mockResolvedValue(testAccountDetails);
    mockedCreateTransaction.mockResolvedValue(true);
    const result = await handleCreate(CreateDepositBodyWithAllData, "123456", session);
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(1);
    expect(mockedFetchAccountDetails).toHaveBeenCalledWith("123456");
    expect(mockedCreateTransaction).toHaveBeenCalledTimes(1);
    expect(mockedCreateTransaction).toHaveBeenCalledWith(transactionToCreate);
  });

  it("User wants to withdraw money from their bank account", async () => {
    const expectedBody = JSON.stringify({
      message: "Transaction has been created successfully",
    });
    const transactionToCreate = {
      userId: "usr-123",
      accountNumber: "123456",
      amount: "100",
      currency: "GBP",
      type: "withdrawal",
      createdTimestamp: "2025-01-01T00:00:00.000Z",
      updatedTimestamp: "2025-01-01T00:00:00.000Z",
    };
    mockedFetchAccountDetails.mockResolvedValue(testAccountDetails);
    mockedCreateTransaction.mockResolvedValue(true);
    const result = await handleCreate(CreateWithdrawalBodyWithAllData, "123456", session);
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(1);
    expect(mockedFetchAccountDetails).toHaveBeenCalledWith("123456");
    expect(mockedCreateTransaction).toHaveBeenCalledTimes(1);
    expect(mockedCreateTransaction).toHaveBeenCalledWith(transactionToCreate);
  });

  it("User wants to withdraw money from their bank account but they have insufficient funds", async () => {
    const expectedBody = JSON.stringify({ message: "Insufficient funds to process transaction" });
    const brokeAccount = { ...testAccountDetails };
    brokeAccount.balance = 0; // Set balance to 0 to simulate insufficient funds
    mockedFetchAccountDetails.mockResolvedValue(brokeAccount);
    mockedCreateTransaction.mockResolvedValue(true);
    const result = await handleCreate(CreateWithdrawalBodyWithAllData, "123456", session);
    expect(result.statusCode).toEqual(422);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(1);
    expect(mockedFetchAccountDetails).toHaveBeenCalledWith("123456");
    expect(mockedCreateTransaction).toHaveBeenCalledTimes(0);
  });

  it("User wants to deposit or withdraw money into another user's bank account", async () => {
    const expectedBody = JSON.stringify({ message: "The user is not allowed to access the transaction" });
    mockedFetchAccountDetails.mockResolvedValue(testAccountDetails);
    mockedCreateTransaction.mockResolvedValue(true);
    const result = await handleCreate(CreateWithdrawalBodyWithAllData, "123456", { userId: "usr-456" });
    expect(result.statusCode).toEqual(403);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(1);
    expect(mockedFetchAccountDetails).toHaveBeenCalledWith("123456");
    expect(mockedCreateTransaction).toHaveBeenCalledTimes(0);
  });

  it("User wants to deposit or withdraw money into a non-existent bank account", async () => {
    const expectedBody = JSON.stringify({ message: "Bank account was not found" });
    mockedFetchAccountDetails.mockResolvedValue(null);
    mockedCreateTransaction.mockResolvedValue(true);
    const result = await handleCreate(CreateWithdrawalBodyWithAllData, "123456", { userId: "usr-456" });
    expect(result.statusCode).toEqual(404);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(1);
    expect(mockedFetchAccountDetails).toHaveBeenCalledWith("123456");
    expect(mockedCreateTransaction).toHaveBeenCalledTimes(0);
  });

  it("User wants to deposit or withdraw money without supplying all required data - missing bank account", async () => {
    const expectedBody = JSON.stringify({ message: "Invalid details supplied" });
    mockedFetchAccountDetails.mockResolvedValue(null);
    mockedCreateTransaction.mockResolvedValue(true);
    const result = await handleCreate(CreateWithdrawalBodyWithAllData, null, { userId: "usr-456" });
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(0);
    expect(mockedCreateTransaction).toHaveBeenCalledTimes(0);
  });

  it("User wants to deposit or withdraw money without supplying all required data - missing body", async () => {
    const expectedBody = JSON.stringify({ message: "Invalid details supplied" });
    mockedFetchAccountDetails.mockResolvedValue(null);
    mockedCreateTransaction.mockResolvedValue(true);
    const result = await handleCreate(null, "123456", { userId: "usr-456" });
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(0);
    expect(mockedCreateTransaction).toHaveBeenCalledTimes(0);
  });

  it("User wants to deposit or withdraw money without supplying all required data - missing data", async () => {
    const expectedBody = JSON.stringify({ message: "Invalid details supplied" });
    mockedFetchAccountDetails.mockResolvedValue(null);
    mockedCreateTransaction.mockResolvedValue(true);
    const result = await handleCreate(CreateWithdrawalBodyMissingAmount, "123456", { userId: "usr-456" });
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(0);
    expect(mockedCreateTransaction).toHaveBeenCalledTimes(0);
  });

  it("User wants to deposit or withdraw money without supplying all required data - invalid amount", async () => {
    const expectedBody = JSON.stringify({ message: "Invalid details supplied" });
    mockedFetchAccountDetails.mockResolvedValue(null);
    mockedCreateTransaction.mockResolvedValue(true);
    const result = await handleCreate(CreateWithdrawalBodyHighWithdrawal, "123456", { userId: "usr-456" });
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(0);
    expect(mockedCreateTransaction).toHaveBeenCalledTimes(0);
  });

  it("Create a new transaction fails to store in database", async () => {
    const expectedBody = JSON.stringify({
      message: "An unexpected error occurred",
    });
    const transactionToCreate = {
      userId: "usr-123",
      accountNumber: "123456",
      amount: "100",
      currency: "GBP",
      type: "deposit",
      createdTimestamp: "2025-01-01T00:00:00.000Z",
      updatedTimestamp: "2025-01-01T00:00:00.000Z",
    };
    mockedFetchAccountDetails.mockResolvedValue(testAccountDetails);
    mockedCreateTransaction.mockResolvedValue(false);
    const result = await handleCreate(CreateDepositBodyWithAllData, "123456", session);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(1);
    expect(mockedFetchAccountDetails).toHaveBeenCalledWith("123456");
    expect(mockedCreateTransaction).toHaveBeenCalledTimes(1);
    expect(mockedCreateTransaction).toHaveBeenCalledWith(transactionToCreate);
  });

  it("Create a new transaction thows unexpected error", async () => {
    const expectedBody = JSON.stringify({
      message: "An unexpected error occurred",
    });
    const transactionToCreate = {
      userId: "usr-123",
      accountNumber: "123456",
      amount: "100",
      currency: "GBP",
      type: "deposit",
      createdTimestamp: "2025-01-01T00:00:00.000Z",
      updatedTimestamp: "2025-01-01T00:00:00.000Z",
    };
    mockedFetchAccountDetails.mockResolvedValue(testAccountDetails);
    mockedCreateTransaction.mockRejectedValue(new Error("Failed to store data"));
    const result = await handleCreate(CreateDepositBodyWithAllData, "123456", session);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(1);
    expect(mockedFetchAccountDetails).toHaveBeenCalledWith("123456");
    expect(mockedCreateTransaction).toHaveBeenCalledTimes(1);
    expect(mockedCreateTransaction).toHaveBeenCalledWith(transactionToCreate);
  });
});
