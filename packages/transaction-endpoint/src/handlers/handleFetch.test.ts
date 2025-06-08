import { handleFetch } from "./handleFetch";
import { fetchTransactionById } from "../store/transactionStore";
import { testTransaction1, testTransactionList } from "../mocks/testTransactions";

const session = { userId: "usr-123" };

jest.mock("../store/transactionStore");
const mockedFetchTransactionById = fetchTransactionById as jest.Mock;

jest.useFakeTimers().setSystemTime(new Date("2025-01-01"));

describe("Handle List Transactions - Core Logic", function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it(" User wants to fetch a transaction on their bank account", async () => {
    const expectedBody = JSON.stringify(testTransaction1);
    mockedFetchTransactionById.mockResolvedValue(testTransaction1);
    const result = await handleFetch("123456", "tan-123", session);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchTransactionById).toHaveBeenCalledTimes(1);
    expect(mockedFetchTransactionById).toHaveBeenCalledWith("tan-123");
  });

  it("User wants to fetch a transaction on another user's bank account", async () => {
    const expectedBody = JSON.stringify({ message: "The user is not allowed to access the transaction" });
    mockedFetchTransactionById.mockResolvedValue(testTransaction1);
    const result = await handleFetch("123456", "tan-123", { userId: "usr-456" });
    expect(result.statusCode).toEqual(403);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchTransactionById).toHaveBeenCalledTimes(1);
    expect(mockedFetchTransactionById).toHaveBeenCalledWith("tan-123");
  });

  it("User wants to fetch a transactions on a non-existent transaction ID", async () => {
    const expectedBody = JSON.stringify({ message: "No transactions found" });
    mockedFetchTransactionById.mockResolvedValue(null);
    const result = await handleFetch("123456", "tan-123", session);
    expect(result.statusCode).toEqual(404);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchTransactionById).toHaveBeenCalledTimes(1);
    expect(mockedFetchTransactionById).toHaveBeenCalledWith("tan-123");
  });

  it("User wants to fetch transaction without supplying all required data", async () => {
    const expectedBody = JSON.stringify({ message: "Invalid details supplied" });
    const result = await handleFetch(null, "tan-123", session);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchTransactionById).toHaveBeenCalledTimes(0);
  });

  it("Create a new transaction thows unexpected error", async () => {
    const expectedBody = JSON.stringify({ message: "An unexpected error occurred" });
    mockedFetchTransactionById.mockRejectedValue(new Error("Failed to store data"));
    const result = await handleFetch("123456", "tan-123", session);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchTransactionById).toHaveBeenCalledTimes(1);
    expect(mockedFetchTransactionById).toHaveBeenCalledWith("tan-123");
  });
});
