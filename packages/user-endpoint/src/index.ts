import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { handleFetch } from "./handlers/handleFetch";
import { handleCreate } from "./handlers/handleCreate";

export const handler = async (event: APIGatewayEvent, context?: Context): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod === "GET") {
    const userId = event.pathParameters?.userId || null;

    const response = await handleFetch(userId);

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
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "User Endpoint is working",
    }),
  };
};
