import { handler } from "./index";
import { APIGatewayProxyEvent } from "aws-lambda";

describe("Customer Event Lambda", function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 when passed an event with empty body", async () => {
    const expectedErrorMessage = JSON.stringify({ message: "Error 400: - Invalid Request Object" });
    const event: APIGatewayProxyEvent = {
      body: null,
    } as any;
    const result = await handler(event);
    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(expectedErrorMessage);
  });

  //Delete when we no longer need to specify a processor
  it("Should return 200 when everything is ok", async () => {
    const expectedErrorMessage = JSON.stringify({ message: "User Endpoint is working" });
    const event: APIGatewayProxyEvent = {
      body: {},
    } as any;
    const result = await handler(event);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(expectedErrorMessage);
  });
});
