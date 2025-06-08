import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { handleAuthentication } from "shared/index";
import { handleCreate } from "./handlers/handleCreate";
import { handleListTransactions } from "./handlers/handleListTransactions";
import { handleFetch } from "./handlers/handleFetch";

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
  } else if (event.httpMethod === "GET") {
    const accountId = event.pathParameters?.accountId || null;
    const transactionId = event.pathParameters?.transactionId || null;

    if (transactionId === null || transactionId === undefined) {
      const response = await handleListTransactions(accountId, session);
      return {
        statusCode: response.statusCode,
        body: response.body,
      };
    } else {
      const response = await handleFetch(accountId, transactionId, session);
      return {
        statusCode: response.statusCode,
        body: response.body,
      };
    }
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      message: "Unsupported HTTP method or missing parameters",
    }),
  };
};
