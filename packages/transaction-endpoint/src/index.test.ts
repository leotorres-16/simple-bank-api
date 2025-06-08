import { handler } from "./index";
import { handleFetch } from "./handlers/handleFetch";
import { handleCreate } from "./handlers/handleCreate";
import { handleListTransactions } from "./handlers/handleListTransactions";
import { CreateTransactionEvent, ListTransactionsEvent, FetchTransactionEvent } from "./mocks/events";
import { handleAuthentication } from "shared/index";
import { testTransaction1, testTransactionList } from "./mocks/testTransactions";
import { CreateDepositBodyWithAllData } from "./mocks/createBody";

jest.mock("./handlers/handleFetch");
const mockedHandleFetch = handleFetch as jest.Mock;

jest.mock("./handlers/handleCreate");
const mockedHandleCreate = handleCreate as jest.Mock;

jest.mock("./handlers/handleListTransactions");
const mockedHandleListTransactions = handleListTransactions as jest.Mock;

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
    const result = await handler(ListTransactionsEvent);
    expect(result.statusCode).toEqual(401);
    expect(result.body).toEqual(expectedBody);
    expect(mockedHandleFetch).toHaveBeenCalledTimes(0);
    expect(mockedHandleCreate).toHaveBeenCalledTimes(0);
    expect(mockedHandleListTransactions).toHaveBeenCalledTimes(0);
  });

  it("Should route to handle fetch given a GET request and transactionId", async () => {
    const expectedBody = JSON.stringify(testTransaction1);
    mockedHandleFetch.mockResolvedValue({
      statusCode: 200,
      body: JSON.stringify(testTransaction1),
    });
    const result = await handler(FetchTransactionEvent);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expectedBody);
    expect(mockedHandleFetch).toHaveBeenCalledTimes(1);
    expect(mockedHandleFetch).toHaveBeenCalledWith("123456", "tan-123", { userId: "usr-123" });
    expect(mockedHandleCreate).toHaveBeenCalledTimes(0);
    expect(mockedHandleListTransactions).toHaveBeenCalledTimes(0);
  });

  it("Should route to handle fetch given a GET request and no transactionId", async () => {
    const expectedBody = JSON.stringify(testTransactionList);
    mockedHandleListTransactions.mockResolvedValue({
      statusCode: 200,
      body: JSON.stringify(testTransactionList),
    });
    const result = await handler(ListTransactionsEvent);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expectedBody);
    expect(mockedHandleListTransactions).toHaveBeenCalledTimes(1);
    expect(mockedHandleListTransactions).toHaveBeenCalledWith("123456", { userId: "usr-123" });
    expect(mockedHandleCreate).toHaveBeenCalledTimes(0);
    expect(mockedHandleFetch).toHaveBeenCalledTimes(0);
  });

  it("Should route to handle create given a POST request", async () => {
    const expectedBody = JSON.stringify(testTransactionList);
    mockedHandleCreate.mockResolvedValue({
      statusCode: 200,
      body: JSON.stringify(testTransactionList),
    });
    const result = await handler(CreateTransactionEvent);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expectedBody);
    expect(mockedHandleCreate).toHaveBeenCalledTimes(1);
    expect(mockedHandleCreate).toHaveBeenCalledWith(CreateDepositBodyWithAllData, "123456", { userId: "usr-123" });
    expect(mockedHandleListTransactions).toHaveBeenCalledTimes(0);
    expect(mockedHandleFetch).toHaveBeenCalledTimes(0);
  });
});
