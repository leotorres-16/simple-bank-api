import { handleCreate } from "./handleCreate";
import { createUser } from "../store/userStore";
import {
  CreateBodyWithAllData,
  CreateBodyWithoutAddress,
  CreateBodyWithoutEmail,
  CreateBodyWithoutName,
  CreateBodyWithoutPhone,
  CreateBodyWithWrongPhone,
  CreateBodyWitWrongEmail,
} from "../mocks/createBody";

jest.mock("../store/userStore");
const mockedCreateUser = createUser as jest.Mock;

jest.useFakeTimers().setSystemTime(new Date("2025-01-01"));

describe("Handle Create - Core Logic", function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Create a new user", async () => {
    const expectedBody = JSON.stringify({ message: "User has been created successfully" });
    mockedCreateUser.mockResolvedValue(true);
    const sentUser = {
      address: {
        county: "Test County",
        line1: "123 Test Street",
        line2: "",
        line3: "",
        postcode: "TE5 6ST",
        town: "Test Town",
      },
      createdTimestamp: "2025-01-01T00:00:00.000Z",
      email: "test@email.com",
      id: "usr-test-user",
      name: "test user",
      phoneNumber: "+123-456-789-1234",
      updatedTimestamp: "2025-01-01T00:00:00.000Z",
    };
    const result = await handleCreate(CreateBodyWithAllData);
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(expectedBody);
    expect(mockedCreateUser).toHaveBeenCalledTimes(1);
    expect(mockedCreateUser).toHaveBeenCalledWith(sentUser);
  });

  it("Create a new user without supplying all required data - Name", async () => {
    const expectedBody = JSON.stringify({ message: "The request didn't supply all the necessary data" });
    mockedCreateUser.mockResolvedValue(null);
    const result = await handleCreate(CreateBodyWithoutName);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedCreateUser).toHaveBeenCalledTimes(0);
  });

  it("Create a new user without supplying all required data - Email", async () => {
    const expectedBody = JSON.stringify({ message: "The request didn't supply all the necessary data" });
    mockedCreateUser.mockResolvedValue(null);
    const result = await handleCreate(CreateBodyWithoutEmail);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedCreateUser).toHaveBeenCalledTimes(0);
  });

  it("Create a new user without supplying all required data - Invalid Email", async () => {
    const expectedBody = JSON.stringify({ message: "The request didn't supply all the necessary data" });
    mockedCreateUser.mockResolvedValue(null);
    const result = await handleCreate(CreateBodyWitWrongEmail);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedCreateUser).toHaveBeenCalledTimes(0);
  });

  it("Create a new user without supplying all required data - Phone", async () => {
    const expectedBody = JSON.stringify({ message: "The request didn't supply all the necessary data" });
    mockedCreateUser.mockResolvedValue(null);
    const result = await handleCreate(CreateBodyWithoutPhone);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedCreateUser).toHaveBeenCalledTimes(0);
  });

  it("Create a new user without supplying all required data - Invalid Phone", async () => {
    const expectedBody = JSON.stringify({ message: "The request didn't supply all the necessary data" });
    mockedCreateUser.mockResolvedValue(null);
    const result = await handleCreate(CreateBodyWithWrongPhone);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedCreateUser).toHaveBeenCalledTimes(0);
  });

  it("Create a new user without supplying all required data - Address", async () => {
    const expectedBody = JSON.stringify({ message: "The request didn't supply all the necessary data" });
    mockedCreateUser.mockResolvedValue(null);
    const result = await handleCreate(CreateBodyWithoutAddress);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedCreateUser).toHaveBeenCalledTimes(0);
  });
  it("Create a new user fails to store in database", async () => {
    const expectedBody = JSON.stringify({ message: "An unexpected error occurred" });
    mockedCreateUser.mockResolvedValue(false);
    const sentUser = {
      address: {
        county: "Test County",
        line1: "123 Test Street",
        line2: "",
        line3: "",
        postcode: "TE5 6ST",
        town: "Test Town",
      },
      createdTimestamp: "2025-01-01T00:00:00.000Z",
      email: "test@email.com",
      id: "usr-test-user",
      name: "test user",
      phoneNumber: "+123-456-789-1234",
      updatedTimestamp: "2025-01-01T00:00:00.000Z",
    };
    const result = await handleCreate(CreateBodyWithAllData);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(expectedBody);
    expect(mockedCreateUser).toHaveBeenCalledTimes(1);
    expect(mockedCreateUser).toHaveBeenCalledWith(sentUser);
  });
  it("Create a new user throws unexpected error", async () => {
    const expectedBody = JSON.stringify({ message: "An unexpected error occurred" });
    mockedCreateUser.mockRejectedValue(new Error("Failed to store data"));
    const sentUser = {
      address: {
        county: "Test County",
        line1: "123 Test Street",
        line2: "",
        line3: "",
        postcode: "TE5 6ST",
        town: "Test Town",
      },
      createdTimestamp: "2025-01-01T00:00:00.000Z",
      email: "test@email.com",
      id: "usr-test-user",
      name: "test user",
      phoneNumber: "+123-456-789-1234",
      updatedTimestamp: "2025-01-01T00:00:00.000Z",
    };
    const result = await handleCreate(CreateBodyWithAllData);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(expectedBody);
    expect(mockedCreateUser).toHaveBeenCalledTimes(1);
    expect(mockedCreateUser).toHaveBeenCalledWith(sentUser);
  });
});
