import { handler } from "./index";
import { APIGatewayProxyEvent } from "aws-lambda";
import { handleFetch } from "./handlers/handleFetch";
import { GetUserByIdEvent } from "./mocks/events";
import { testUser } from "./mocks/testUsers";

jest.mock("./handlers/handleFetch");
const mockedHandleFetch = handleFetch as jest.Mock;

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
  });
});
