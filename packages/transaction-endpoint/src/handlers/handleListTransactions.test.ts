import { handleListTransactions } from "./handleListTransactions";
import { fetchTransactionsForAccount } from "../store/transactionStore";
import { testTransactionList } from "../mocks/testTransactions";

const session = { userId: "usr-123" };

jest.mock("../store/transactionStore");
const mockedFetchTransactionsForAccount = fetchTransactionsForAccount as jest.Mock;

jest.useFakeTimers().setSystemTime(new Date("2025-01-01"));

describe("Handle List Transactions - Core Logic", function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("User wants to view all transactions on their bank account", async () => {
    const expectedBody = JSON.stringify(testTransactionList);
    mockedFetchTransactionsForAccount.mockResolvedValue(testTransactionList);
    const result = await handleListTransactions("123456", session);
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchTransactionsForAccount).toHaveBeenCalledTimes(1);
    expect(mockedFetchTransactionsForAccount).toHaveBeenCalledWith("123456");
  });

  it("User wants to view all transactions on another user's bank account", async () => {
    const expectedBody = JSON.stringify({ message: "The user is not allowed to access the transaction" });
    mockedFetchTransactionsForAccount.mockResolvedValue(testTransactionList);
    const result = await handleListTransactions("123456", { userId: "usr-456" });
    expect(result.statusCode).toEqual(403);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchTransactionsForAccount).toHaveBeenCalledTimes(1);
    expect(mockedFetchTransactionsForAccount).toHaveBeenCalledWith("123456");
  });

  it("User wants to view all transactions on a non-existent bank account", async () => {
    const expectedBody = JSON.stringify({ message: "No transactions found" });
    mockedFetchTransactionsForAccount.mockResolvedValue(null);
    const result = await handleListTransactions("123456", session);
    expect(result.statusCode).toEqual(404);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchTransactionsForAccount).toHaveBeenCalledTimes(1);
    expect(mockedFetchTransactionsForAccount).toHaveBeenCalledWith("123456");
  });

  it("User wants to list transactions without supplying all required data", async () => {
    const expectedBody = JSON.stringify({ message: "Invalid details supplied" });
    const result = await handleListTransactions(null, session);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchTransactionsForAccount).toHaveBeenCalledTimes(0);
  });

  it("Create a new transaction thows unexpected error", async () => {
    const expectedBody = JSON.stringify({ message: "An unexpected error occurred" });
    mockedFetchTransactionsForAccount.mockRejectedValue(new Error("Failed to store data"));
    const result = await handleListTransactions("123456", session);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchTransactionsForAccount).toHaveBeenCalledTimes(1);
    expect(mockedFetchTransactionsForAccount).toHaveBeenCalledWith("123456");
  });
});
