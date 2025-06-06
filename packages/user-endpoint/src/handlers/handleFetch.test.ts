import { handleFetch } from "./handleFetch";
import { fetchUser } from "../store/userStore";
import { testUser } from "../mocks/testUsers";

jest.mock("../store/userStore");
const mockedFetchUser = fetchUser as jest.Mock;

const session = { urserId: "usr-123" };

describe("Handle Fetch - Core Logic", function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("User wants to fetch their details", async () => {
    const expectedBody = JSON.stringify(testUser);
    mockedFetchUser.mockResolvedValue(testUser);
    const result = await handleFetch("usr-123", session);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchUser).toHaveBeenCalledTimes(1);
    expect(mockedFetchUser).toHaveBeenCalledWith("usr-123");
  });

  it("User wants to fetch the user details of a non-existent user - database returns null", async () => {
    const expectedBody = JSON.stringify({ message: "User was not found" });
    mockedFetchUser.mockResolvedValue(null);
    const result = await handleFetch("usr-123", session);
    expect(result.statusCode).toEqual(404);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchUser).toHaveBeenCalledTimes(1);
    expect(mockedFetchUser).toHaveBeenCalledWith("usr-123");
  });

  it("User wants to fetch the user details of a non-existent user - no user in request", async () => {
    const expectedBody = JSON.stringify({ message: "The request didn't supply all the necessary data" });
    const result = await handleFetch(null, session);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchUser).toHaveBeenCalledTimes(0);
  });

  it("User wants to fetch the user details of a non-existent user - id has wrong format", async () => {
    const expectedBody = JSON.stringify({ message: "The request didn't supply all the necessary data" });
    const result = await handleFetch("invalid-id", session);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchUser).toHaveBeenCalledTimes(0);
  });

  it("User wants to fetch the user details of another user", async () => {
    const expectedBody = JSON.stringify({ message: "The user is not allowed to access the transaction" });
    const result = await handleFetch("usr-123", { urserId: "usr-456" });
    expect(result.statusCode).toEqual(403);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchUser).toHaveBeenCalledTimes(0);
  });
});
