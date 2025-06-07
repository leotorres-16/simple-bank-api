import { handleCreate } from "./handleCreate";
import { createAccount } from "../store/accountStore";
import { CreateBodyWithAllData, CreateBodyWithInvalidAccountType, CreateBodyWithoutAccountType, CreateBodyWithoutName } from "../mocks/createBody";
import { AccountType } from "shared/index";
import { testAccount } from "../mocks/testAccount";

jest.mock("../store/accountStore");
const mockedCreateAccount = createAccount as jest.Mock;

jest.useFakeTimers().setSystemTime(new Date("2025-01-01"));

describe("Handle Create - Core Logic", function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Create a new bank account", async () => {
    const expectedBody = JSON.stringify({
      message: "Bank Account has been created successfully",
      account: testAccount,
    });
    mockedCreateAccount.mockResolvedValue(testAccount);
    const result = await handleCreate(CreateBodyWithAllData);
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(expectedBody);
    expect(mockedCreateAccount).toHaveBeenCalledTimes(1);
    expect(mockedCreateAccount).toHaveBeenCalledWith("test account", AccountType.PERSONAL);
  });

  it("Create a new bank account without supplying all required data - Name", async () => {
    const expectedBody = JSON.stringify({ message: "Invalid details supplied" });
    mockedCreateAccount.mockResolvedValue(null);
    const result = await handleCreate(CreateBodyWithoutName);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedCreateAccount).toHaveBeenCalledTimes(0);
  });

  it("Create a new bank account without supplying all required data - Account Type", async () => {
    const expectedBody = JSON.stringify({ message: "Invalid details supplied" });
    mockedCreateAccount.mockResolvedValue(null);
    const result = await handleCreate(CreateBodyWithoutAccountType);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedCreateAccount).toHaveBeenCalledTimes(0);
  });

  it("Create a new bank account without supplying all required data - Invalid Account Type", async () => {
    const expectedBody = JSON.stringify({ message: "Invalid details supplied" });
    mockedCreateAccount.mockResolvedValue(null);
    const result = await handleCreate(CreateBodyWithInvalidAccountType);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedBody);
    expect(mockedCreateAccount).toHaveBeenCalledTimes(0);
  });

  it("Create a new bank account fails to store in database", async () => {
    const expectedBody = JSON.stringify({ message: "An unexpected error occurred" });
    mockedCreateAccount.mockResolvedValue(null);
    const result = await handleCreate(CreateBodyWithAllData);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(expectedBody);
    expect(mockedCreateAccount).toHaveBeenCalledTimes(1);
    expect(mockedCreateAccount).toHaveBeenCalledWith("test account", AccountType.PERSONAL);
  });
  it("Create a new bank account throws unexpected error", async () => {
    const expectedBody = JSON.stringify({ message: "An unexpected error occurred" });
    mockedCreateAccount.mockRejectedValue(new Error("Failed to store data"));
    const result = await handleCreate(CreateBodyWithAllData);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(expectedBody);
    expect(mockedCreateAccount).toHaveBeenCalledTimes(1);
    expect(mockedCreateAccount).toHaveBeenCalledWith("test account", AccountType.PERSONAL);
  });
});
