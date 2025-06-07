import { handleDelete } from "./handleDelete";
import { deleteAccount, fetchAccountDetails } from "../store/accountStore";
import { testAccount } from "../mocks/testAccount";

jest.mock("../store/accountStore");
const mockedFetchAccountDetails = fetchAccountDetails as jest.Mock;
const mockedDeleteAccount = deleteAccount as jest.Mock;

const session = { userId: "usr-123" };

describe("Handle Delete - Core Logic", function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("User wants to delete their account", async () => {
    const expectedBody = JSON.stringify({ message: "The user has been deleted" });
    mockedFetchAccountDetails.mockResolvedValue(testAccount);
    mockedDeleteAccount.mockResolvedValue(true);
    const result = await handleDelete("usr-123", session);
    expect(result.statusCode).toEqual(204);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(1);
    expect(mockedFetchAccountDetails).toHaveBeenCalledWith("usr-123");
    expect(mockedDeleteAccount).toHaveBeenCalledTimes(1);
    expect(mockedDeleteAccount).toHaveBeenCalledWith("usr-123");
  });

  it("User wants to delete account that doesn't exist - database returns null", async () => {
    const expectedBody = JSON.stringify({ message: "Bank account was not found" });
    mockedFetchAccountDetails.mockResolvedValue(null);
    const result = await handleDelete("123456", session);
    expect(result.statusCode).toEqual(404);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(1);
    expect(mockedFetchAccountDetails).toHaveBeenCalledWith("123456");
    expect(mockedDeleteAccount).toHaveBeenCalledTimes(0);
  });

  it("User wants to delete account details of another user", async () => {
    const expectedBody = JSON.stringify({ message: "The user is not allowed to delete the bank account details" });
    mockedFetchAccountDetails.mockResolvedValue(testAccount);
    const result = await handleDelete("123456", { userId: "usr-456" });
    expect(result.statusCode).toEqual(403);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(1);
    expect(mockedFetchAccountDetails).toHaveBeenCalledWith("123456");
    expect(mockedDeleteAccount).toHaveBeenCalledTimes(0);
  });

  it("User wants to delete the account details of a non-existent account - no account in request", async () => {
    const expectedBody = JSON.stringify({ message: "The request didn't supply all the necessary data" });
    const result = await handleDelete(null, session);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(0);
    expect(mockedDeleteAccount).toHaveBeenCalledTimes(0);
  });

  it("Delete a user fails to store in database", async () => {
    const expectedBody = JSON.stringify({ message: "An unexpected error occurred" });
    mockedFetchAccountDetails.mockResolvedValue(testAccount);
    mockedDeleteAccount.mockResolvedValue(false);
    const result = await handleDelete("123456", session);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(1);
    expect(mockedFetchAccountDetails).toHaveBeenCalledWith("123456");
    expect(mockedDeleteAccount).toHaveBeenCalledTimes(1);
    expect(mockedDeleteAccount).toHaveBeenCalledWith("123456");
  });

  it("Delete a user fails because error was thrown", async () => {
    const expectedBody = JSON.stringify({ message: "An unexpected error occurred" });
    mockedFetchAccountDetails.mockResolvedValue(testAccount);
    mockedDeleteAccount.mockRejectedValue(new Error("Failed to store data"));
    const result = await handleDelete("123456", session);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(1);
    expect(mockedFetchAccountDetails).toHaveBeenCalledWith("123456");
    expect(mockedDeleteAccount).toHaveBeenCalledTimes(1);
    expect(mockedDeleteAccount).toHaveBeenCalledWith("123456");
  });
});
