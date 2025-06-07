import { handleFetch } from "./handleFetch";
import { fetchAccountDetails, fetchAccounts } from "../store/accountStore";
import { testAccount } from "../mocks/testAccount";

jest.mock("../store/accountStore");
const mockedFetchAccountDetails = fetchAccountDetails as jest.Mock;
const mockedFetchAccounts = fetchAccounts as jest.Mock;

const session = { userId: "usr-123" };

describe("Handle Fetch - Core Logic", function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("User wants to fetch their account details", async () => {
    const expectedBody = JSON.stringify(testAccount);
    mockedFetchAccountDetails.mockResolvedValue(testAccount);
    const result = await handleFetch("123456", session);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(1);
    expect(mockedFetchAccountDetails).toHaveBeenCalledWith("123456");
  });

  it("User wants to fetch the account details of a non-existent account - database returns null", async () => {
    const expectedBody = JSON.stringify({ message: "Bank account was not found" });
    mockedFetchAccountDetails.mockResolvedValue(null);
    const result = await handleFetch("123456", session);
    expect(result.statusCode).toEqual(404);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(1);
    expect(mockedFetchAccountDetails).toHaveBeenCalledWith("123456");
  });

  it("User wants to fetch the account details of another user", async () => {
    const expectedBody = JSON.stringify({ message: "The user is not allowed to access the bank account details" });
    mockedFetchAccountDetails.mockResolvedValue(testAccount);
    const result = await handleFetch("123456", { userId: "usr-456" });
    expect(result.statusCode).toEqual(403);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccountDetails).toHaveBeenCalledTimes(1);
  });

  it("User wants to fetch all their accounts", async () => {
    const expectedBody = JSON.stringify({ accounts: [testAccount] });
    mockedFetchAccounts.mockResolvedValue([testAccount]);
    const result = await handleFetch(null, session);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccounts).toHaveBeenCalledTimes(1);
    expect(mockedFetchAccounts).toHaveBeenCalledWith("usr-123");
  });

  it("User wants to fetch all their accounts but there are none", async () => {
    const expectedBody = JSON.stringify({ message: "No bank accounts found for the user" });
    mockedFetchAccounts.mockResolvedValue(null);
    const result = await handleFetch(null, session);
    expect(result.statusCode).toEqual(404);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchAccounts).toHaveBeenCalledTimes(1);
    expect(mockedFetchAccounts).toHaveBeenCalledWith("usr-123");
  });
});
