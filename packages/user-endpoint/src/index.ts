import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { handleFetch } from "./handlers/handleFetch";
import { handleCreate } from "./handlers/handleCreate";
import { handleDelete } from "./handlers/handleDelete";
import { handleAuthentication } from "./handlers/handleAuthentication";
import { handleUpdate } from "./handlers/handleUpdate";

export const handler = async (event: APIGatewayEvent, context?: Context): Promise<APIGatewayProxyResult> => {
  // Handle authentication
  const session = await handleAuthentication(event.headers.Authorization || null);
  if (!session || !session.urserId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Access token is missing or invalid" }),
    };
  }
  if (event.httpMethod === "GET") {
    const userId = event.pathParameters?.userId || null;

    const response = await handleFetch(userId, session);

    return {
      statusCode: response.statusCode,
      body: response.body,
    };
  } else if (event.httpMethod === "POST") {
    const response = await handleCreate(event.body);
    return {
      statusCode: response.statusCode,
      body: response.body,
    };
  } else if (event.httpMethod === "DELETE") {
    const userId = event.pathParameters?.userId || null;

    const response = await handleDelete(userId, session);

    return {
      statusCode: response.statusCode,
      body: response.body,
    };
  } else if (event.httpMethod === "PATCH") {
    const userId = event.pathParameters?.userId || null;

    const response = await handleUpdate(event.body, userId, session);

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
