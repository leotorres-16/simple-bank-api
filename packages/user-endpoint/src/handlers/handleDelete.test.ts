import { handleDelete } from "./handleDelete";
import { deleteUser, fetchUser } from "../store/userStore";
import { testUser } from "../mocks/testUsers";

jest.mock("../store/userStore");
const mockedFetchUser = fetchUser as jest.Mock;
const mockedDeleteUser = deleteUser as jest.Mock;

const session = { userId: "usr-123" };

describe("Handle Delete - Core Logic", function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("User wants to delete their details", async () => {
    const expectedBody = JSON.stringify({ message: "The user has been deleted" });
    mockedFetchUser.mockResolvedValue(testUser);
    mockedDeleteUser.mockResolvedValue(true);
    const result = await handleDelete("usr-123", session);
    expect(result.statusCode).toEqual(204);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchUser).toHaveBeenCalledTimes(1);
    expect(mockedFetchUser).toHaveBeenCalledWith("usr-123");
    expect(mockedDeleteUser).toHaveBeenCalledTimes(1);
    expect(mockedDeleteUser).toHaveBeenCalledWith("usr-123");
  });

  it("User wants to delete the user details of a non-existent user - database returns null", async () => {
    const expectedBody = JSON.stringify({ message: "User was not found" });
    mockedFetchUser.mockResolvedValue(null);
    const result = await handleDelete("usr-123", session);
    expect(result.statusCode).toEqual(404);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchUser).toHaveBeenCalledTimes(1);
    expect(mockedFetchUser).toHaveBeenCalledWith("usr-123");
    expect(mockedDeleteUser).toHaveBeenCalledTimes(0);
  });

  it("User wants to delete user details of another user", async () => {
    const expectedBody = JSON.stringify({ message: "The user is not allowed to access the transaction" });
    mockedFetchUser.mockResolvedValue(testUser);
    const result = await handleDelete("usr-123", { userId: "usr-456" });
    expect(result.statusCode).toEqual(403);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchUser).toHaveBeenCalledTimes(1);
    expect(mockedFetchUser).toHaveBeenCalledWith("usr-123");
    expect(mockedDeleteUser).toHaveBeenCalledTimes(0);
  });

  it("User wants to delete the user details of a non-existent user - no user in request", async () => {
    const expectedBody = JSON.stringify({ message: "The request didn't supply all the necessary data" });
    const result = await handleDelete(null, session);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchUser).toHaveBeenCalledTimes(0);
    expect(mockedDeleteUser).toHaveBeenCalledTimes(0);
  });

  it("User wants to delete the user details of a non-existent user - id has wrong format", async () => {
    const expectedBody = JSON.stringify({ message: "The request didn't supply all the necessary data" });
    const result = await handleDelete("invalid-id", session);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchUser).toHaveBeenCalledTimes(0);
    expect(mockedDeleteUser).toHaveBeenCalledTimes(0);
  });

  it("User wants to delete the user details when there is an associated account", async () => {
    const expectedBody = JSON.stringify({ message: "A user cannot be deleted when they are associated with a bank account" });
    const userWithAccount = { ...testUser, bankAccounts: [{ id: "acc-123" }] };
    mockedFetchUser.mockResolvedValue(userWithAccount);
    const result = await handleDelete("usr-123", session);
    expect(result.statusCode).toEqual(409);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchUser).toHaveBeenCalledTimes(1);
    expect(mockedDeleteUser).toHaveBeenCalledTimes(0);
  });

  it("Delete a user fails to store in database", async () => {
    const expectedBody = JSON.stringify({ message: "An unexpected error occurred" });
    mockedFetchUser.mockResolvedValue(testUser);
    mockedDeleteUser.mockResolvedValue(false);
    const result = await handleDelete("usr-123", session);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchUser).toHaveBeenCalledTimes(1);
    expect(mockedFetchUser).toHaveBeenCalledWith("usr-123");
    expect(mockedDeleteUser).toHaveBeenCalledTimes(1);
    expect(mockedDeleteUser).toHaveBeenCalledWith("usr-123");
  });

  it("Delete a user fails because error was thrown", async () => {
    const expectedBody = JSON.stringify({ message: "An unexpected error occurred" });
    mockedFetchUser.mockResolvedValue(testUser);
    mockedDeleteUser.mockRejectedValue(new Error("Failed to store data"));
    const result = await handleDelete("usr-123", session);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchUser).toHaveBeenCalledTimes(1);
    expect(mockedFetchUser).toHaveBeenCalledWith("usr-123");
    expect(mockedDeleteUser).toHaveBeenCalledTimes(1);
    expect(mockedDeleteUser).toHaveBeenCalledWith("usr-123");
  });
});
