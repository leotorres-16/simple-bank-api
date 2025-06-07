import { handleUpdate } from "./handleUpdate";
import { createOrUpdateUser, fetchUser } from "../store/userStore";
import { testUser } from "../mocks/testUsers";
import { UpdateBodyWithAllData } from "../mocks/updateBody";

jest.mock("../store/userStore");
const mockedFetchUser = fetchUser as jest.Mock;
const mockedUpdateUser = createOrUpdateUser as jest.Mock;

const session = { userId: "usr-123" };

jest.useFakeTimers().setSystemTime(new Date("2025-01-01"));

describe("Handle Update - Core Logic", function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("User wants to update their details", async () => {
    const expectedBody = JSON.stringify({ message: "Updated name,address,phoneNumber" });
    const expectedUserToSend = {
      address: {
        county: "Test County",
        line1: "123 Test Street",
        line2: "",
        line3: "",
        postcode: "TE5 6ST",
        town: "Test Town",
      },
      createdTimestamp: "",
      email: "test@email.com",
      id: "usr-123",
      name: "test user",
      phoneNumber: "+123-456-789-1234",
      updatedTimestamp: "2025-01-01T00:00:00.000Z",
    };
    mockedFetchUser.mockResolvedValue(testUser);
    const result = await handleUpdate(UpdateBodyWithAllData, "usr-123", session);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchUser).toHaveBeenCalledTimes(1);
    expect(mockedFetchUser).toHaveBeenCalledWith("usr-123");
    expect(mockedUpdateUser).toHaveBeenCalledTimes(1);
    expect(mockedUpdateUser).toHaveBeenCalledWith(expectedUserToSend);
  });

  it("User wants to update the details of a non-existent user - database returns null", async () => {
    const expectedBody = JSON.stringify({ message: "User was not found" });
    mockedFetchUser.mockResolvedValue(null);
    const result = await handleUpdate(null, "usr-123", session);
    expect(result.statusCode).toEqual(404);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchUser).toHaveBeenCalledTimes(1);
    expect(mockedFetchUser).toHaveBeenCalledWith("usr-123");
  });

  it("User wants to update the details of a non-existent user - no user in request", async () => {
    const expectedBody = JSON.stringify({ message: "The request didn't supply all the necessary data" });
    const result = await handleUpdate(null, null, session);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchUser).toHaveBeenCalledTimes(0);
  });

  it("User wants to update the details of a non-existent user - id has wrong format", async () => {
    const expectedBody = JSON.stringify({ message: "The request didn't supply all the necessary data" });
    const result = await handleUpdate(null, "invalid-id", session);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchUser).toHaveBeenCalledTimes(0);
  });

  it("User wants to update the details of another user", async () => {
    const expectedBody = JSON.stringify({ message: "The user is not allowed to access the transaction" });
    const result = await handleUpdate(null, "usr-123", { userId: "usr-456" });
    expect(result.statusCode).toEqual(403);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchUser).toHaveBeenCalledTimes(0);
  });

  it("Update a new user fails to store in database", async () => {
    const expectedBody = JSON.stringify({ message: "An unexpected error occurred" });
    mockedUpdateUser.mockResolvedValue(false);
    const expectedUserToSend = {
      address: {
        county: "Test County",
        line1: "123 Test Street",
        line2: "",
        line3: "",
        postcode: "TE5 6ST",
        town: "Test Town",
      },
      createdTimestamp: "",
      email: "test@email.com",
      id: "usr-123",
      name: "test user",
      phoneNumber: "+123-456-789-1234",
      updatedTimestamp: "2025-01-01T00:00:00.000Z",
    };
    mockedFetchUser.mockResolvedValue(testUser);
    const result = await handleUpdate(UpdateBodyWithAllData, "usr-123", session);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchUser).toHaveBeenCalledTimes(1);
    expect(mockedFetchUser).toHaveBeenCalledWith("usr-123");
    expect(mockedUpdateUser).toHaveBeenCalledTimes(1);
    expect(mockedUpdateUser).toHaveBeenCalledWith(expectedUserToSend);
  });
  it("Create a new user throws unexpected error", async () => {
    const expectedBody = JSON.stringify({ message: "An unexpected error occurred" });
    mockedUpdateUser.mockRejectedValue(new Error("Failed to store data"));
    const expectedUserToSend = {
      address: {
        county: "Test County",
        line1: "123 Test Street",
        line2: "",
        line3: "",
        postcode: "TE5 6ST",
        town: "Test Town",
      },
      createdTimestamp: "",
      email: "test@email.com",
      id: "usr-123",
      name: "test user",
      phoneNumber: "+123-456-789-1234",
      updatedTimestamp: "2025-01-01T00:00:00.000Z",
    };
    mockedFetchUser.mockResolvedValue(testUser);
    const result = await handleUpdate(UpdateBodyWithAllData, "usr-123", session);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(expectedBody);
    expect(mockedFetchUser).toHaveBeenCalledTimes(1);
    expect(mockedFetchUser).toHaveBeenCalledWith("usr-123");
    expect(mockedUpdateUser).toHaveBeenCalledTimes(1);
    expect(mockedUpdateUser).toHaveBeenCalledWith(expectedUserToSend);
  });
});
