import { handleUpdate } from "./handleUpdate";
import { fetchAccountDetails, updateAccountDetails } from "../store/accountStore";
import { UpdateBodyWithAllData } from "../mocks/updateBody";
import { testAccount, testAccountForUpdate } from "../mocks/testAccount";

jest.mock("../store/accountStore");
const mockedFetchAccountDetails = fetchAccountDetails as jest.Mock;
const mockedUpdateAccountDetails = updateAccountDetails as jest.Mock;

const session = { userId: "usr-123" };

jest.useFakeTimers().setSystemTime(new Date("2025-01-01"));

describe("Handle Update - Core Logic", function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("User wants to update their account details", async () => {
    const expectedBody = JSON.stringify({ message: "Updated name" });
    const expectedUserToSend = {
      accountNumber: "12345678",
      accountType: "personal",
      balance: 0,
      createdTimestamp: "2025-01-01T00:00:00.000Z",
      currency: "GBP",
      name: "test account updated",
      sortCode: "10-10-10",
      updatedTimestamp: "2025-01-01T00:00:00.000Z",
      userId: "usr-123",
    };
    mockedFetchAccountDetails.mockResolvedValue(testAccountForUpdate);
    mockedUpdateAccountDetails.mockResolvedValue(true);
    const result = await handleUpdate(UpdateBodyWithAllData, "123456", session);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(1);
    expect(mockedFetchAccountDetails).toHaveBeenCalledWith("123456");
    expect(mockedUpdateAccountDetails).toHaveBeenCalledTimes(1);
    expect(mockedUpdateAccountDetails).toHaveBeenCalledWith(expectedUserToSend);
  });

  it("User wants to update the details of a non-existent account - database returns null", async () => {
    const expectedBody = JSON.stringify({ message: "Bank account was not found" });
    mockedFetchAccountDetails.mockResolvedValue(null);
    const result = await handleUpdate(UpdateBodyWithAllData, "123456", session);
    expect(result.statusCode).toEqual(404);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(1);
    expect(mockedFetchAccountDetails).toHaveBeenCalledWith("123456");
  });

  it("User wants to update the details of a non-existent account - no account in request", async () => {
    const expectedBody = JSON.stringify({ message: "The request didn't supply all the necessary data" });
    const result = await handleUpdate(UpdateBodyWithAllData, null, session);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(0);
  });

  it("User wants to update the details of another user", async () => {
    const expectedBody = JSON.stringify({ message: "The user is not allowed to update the bank account details" });
    mockedFetchAccountDetails.mockResolvedValue(testAccountForUpdate);
    const result = await handleUpdate(UpdateBodyWithAllData, "123456", { userId: "usr-456" });
    expect(result.statusCode).toEqual(403);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(1);
  });

  it("Update the account details fails to store in database", async () => {
    const expectedBody = JSON.stringify({ message: "An unexpected error occurred" });
    const expectedUserToSend = {
      accountNumber: "12345678",
      accountType: "personal",
      balance: 0,
      createdTimestamp: "2025-01-01T00:00:00.000Z",
      currency: "GBP",
      name: "test account updated",
      sortCode: "10-10-10",
      updatedTimestamp: "2025-01-01T00:00:00.000Z",
      userId: "usr-123",
    };
    mockedFetchAccountDetails.mockResolvedValue(testAccountForUpdate);
    mockedUpdateAccountDetails.mockResolvedValue(false);
    const result = await handleUpdate(UpdateBodyWithAllData, "123456", session);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(1);
    expect(mockedFetchAccountDetails).toHaveBeenCalledWith("123456");
    expect(mockedUpdateAccountDetails).toHaveBeenCalledTimes(1);
    expect(mockedUpdateAccountDetails).toHaveBeenCalledWith(expectedUserToSend);
  });

  it("Update the account details throws unexpected error", async () => {
    const expectedBody = JSON.stringify({ message: "An unexpected error occurred" });
    const expectedUserToSend = {
      accountNumber: "12345678",
      accountType: "personal",
      balance: 0,
      createdTimestamp: "2025-01-01T00:00:00.000Z",
      currency: "GBP",
      name: "test account updated",
      sortCode: "10-10-10",
      updatedTimestamp: "2025-01-01T00:00:00.000Z",
      userId: "usr-123",
    };
    mockedFetchAccountDetails.mockResolvedValue(testAccountForUpdate);
    mockedUpdateAccountDetails.mockRejectedValue(new Error("Failed to store data"));
    const result = await handleUpdate(UpdateBodyWithAllData, "123456", session);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(1);
    expect(mockedFetchAccountDetails).toHaveBeenCalledWith("123456");
    expect(mockedUpdateAccountDetails).toHaveBeenCalledTimes(1);
    expect(mockedUpdateAccountDetails).toHaveBeenCalledWith(expectedUserToSend);
  });
});
