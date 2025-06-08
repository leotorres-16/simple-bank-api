import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { handleAuthentication } from "shared/index";
import { handleCreate } from "./handlers/handleCreate";

export const handler = async (event: APIGatewayEvent, context?: Context): Promise<APIGatewayProxyResult> => {
  // Handle authentication
  const session = await handleAuthentication(event.headers.Authorization || null);
  if (!session || !session.userId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Access token is missing or invalid" }),
    };
  }

  if (event.httpMethod === "POST") {
    const accountId = event.pathParameters?.accountId || null;

    const response = await handleCreate(event.body, accountId, session);
    return {
      statusCode: response.statusCode,
      body: response.body,
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "User Endpoint is working",
    }),
  };
};
