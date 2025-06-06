import { handler } from "./index";
import { handleFetch } from "./handlers/handleFetch";
import { handleCreate } from "./handlers/handleCreate";
import { CreateUserEvent, GetUserByIdEvent } from "./mocks/events";
import { testUser } from "./mocks/testUsers";

jest.mock("./handlers/handleFetch");
const mockedHandleFetch = handleFetch as jest.Mock;

jest.mock("./handlers/handleCreate");
const mockedHandleCreate = handleCreate as jest.Mock;

describe("Index tests - Routing", function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should route to handle fetch given a GET request", async () => {
    const expectedBody = JSON.stringify(testUser);
    mockedHandleFetch.mockResolvedValue({
      statusCode: 200,
      body: JSON.stringify(testUser),
    });
    const result = await handler(GetUserByIdEvent);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expectedBody);
    expect(mockedHandleFetch).toHaveBeenCalledTimes(1);
    expect(mockedHandleFetch).toHaveBeenCalledWith("usr-123");
    expect(mockedHandleCreate).toHaveBeenCalledTimes(0);
  });

  it("Should route to handle create given a POST request", async () => {
    const expectedBody = JSON.stringify(testUser);
    mockedHandleCreate.mockResolvedValue({
      statusCode: 200,
      body: JSON.stringify(testUser),
    });
    const result = await handler(CreateUserEvent);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expectedBody);
    expect(mockedHandleCreate).toHaveBeenCalledTimes(1);
    expect(mockedHandleCreate).toHaveBeenCalledWith(CreateUserEvent.body);
    expect(mockedHandleFetch).toHaveBeenCalledTimes(0);
  });
});
