import { handler } from "./index";
import { handleFetch } from "./handlers/handleFetch";
import { handleCreate } from "./handlers/handleCreate";
import { handleDelete } from "./handlers/handleDelete";
import { handleUpdate } from "./handlers/handleUpdate";
import { CreateBankAccountEvent, DeleteUserEvent, GetUserByIdEvent, UpdateUserEvent } from "./mocks/events";
import { handleAuthentication } from "shared/index";
import { testAccount } from "./mocks/testAccount";

jest.mock("./handlers/handleFetch");
const mockedHandleFetch = handleFetch as jest.Mock;

jest.mock("./handlers/handleCreate");
const mockedHandleCreate = handleCreate as jest.Mock;

jest.mock("./handlers/handleDelete");
const mockedHandleDelete = handleDelete as jest.Mock;

jest.mock("./handlers/handleUpdate");
const mockedHandleUpdate = handleUpdate as jest.Mock;

jest.mock("shared/index");
const mockedHandleAuthentication = handleAuthentication as jest.Mock;

describe("Index tests - Routing", function () {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedHandleAuthentication.mockResolvedValue({ userId: "usr-123" });
  });

  it("Should return unauthorized if authentication fails", async () => {
    const expectedBody = JSON.stringify({ message: "Access token is missing or invalid" });
    mockedHandleAuthentication.mockResolvedValue(null);
    const result = await handler(GetUserByIdEvent);
    expect(result.statusCode).toEqual(401);
    expect(result.body).toEqual(expectedBody);
    expect(mockedHandleFetch).toHaveBeenCalledTimes(0);
    expect(mockedHandleCreate).toHaveBeenCalledTimes(0);
    expect(mockedHandleDelete).toHaveBeenCalledTimes(0);
    expect(mockedHandleUpdate).toHaveBeenCalledTimes(0);
  });

  it("Should route to handle fetch given a GET request", async () => {
    const expectedBody = JSON.stringify(testAccount);
    mockedHandleFetch.mockResolvedValue({
      statusCode: 200,
      body: JSON.stringify(testAccount),
    });
    const result = await handler(GetUserByIdEvent);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expectedBody);
    expect(mockedHandleFetch).toHaveBeenCalledTimes(1);
    expect(mockedHandleFetch).toHaveBeenCalledWith("usr-123", { userId: "usr-123" });
    expect(mockedHandleCreate).toHaveBeenCalledTimes(0);
    expect(mockedHandleDelete).toHaveBeenCalledTimes(0);
    expect(mockedHandleUpdate).toHaveBeenCalledTimes(0);
  });

  it("Should route to handle create given a POST request", async () => {
    const expectedBody = JSON.stringify(testAccount);
    mockedHandleCreate.mockResolvedValue({
      statusCode: 200,
      body: JSON.stringify(testAccount),
    });
    const result = await handler(CreateBankAccountEvent);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expectedBody);
    expect(mockedHandleCreate).toHaveBeenCalledTimes(1);
    expect(mockedHandleCreate).toHaveBeenCalledWith(CreateBankAccountEvent.body);
    expect(mockedHandleFetch).toHaveBeenCalledTimes(0);
    expect(mockedHandleDelete).toHaveBeenCalledTimes(0);
    expect(mockedHandleUpdate).toHaveBeenCalledTimes(0);
  });

  it("Should route to handle delete given a POST request", async () => {
    const expectedBody = JSON.stringify(testAccount);
    mockedHandleDelete.mockResolvedValue({
      statusCode: 200,
      body: JSON.stringify(testAccount),
    });
    const result = await handler(DeleteUserEvent);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expectedBody);
    expect(mockedHandleDelete).toHaveBeenCalledTimes(1);
    expect(mockedHandleDelete).toHaveBeenCalledWith("usr-123", { userId: "usr-123" });
    expect(mockedHandleFetch).toHaveBeenCalledTimes(0);
    expect(mockedHandleCreate).toHaveBeenCalledTimes(0);
    expect(mockedHandleUpdate).toHaveBeenCalledTimes(0);
  });

  it("Should route to handle update given a POST request", async () => {
    const expectedBody = JSON.stringify(testAccount);
    mockedHandleUpdate.mockResolvedValue({
      statusCode: 200,
      body: JSON.stringify(testAccount),
    });
    const result = await handler(UpdateUserEvent);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expectedBody);
    expect(mockedHandleUpdate).toHaveBeenCalledTimes(1);
    expect(mockedHandleUpdate).toHaveBeenCalledWith(UpdateUserEvent.body, "usr-123", { userId: "usr-123" });
    expect(mockedHandleFetch).toHaveBeenCalledTimes(0);
    expect(mockedHandleCreate).toHaveBeenCalledTimes(0);
    expect(mockedHandleDelete).toHaveBeenCalledTimes(0);
  });
});
