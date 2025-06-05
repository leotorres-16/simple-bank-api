import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";

export const handler = async (event: APIGatewayEvent, context?: Context): Promise<APIGatewayProxyResult> => {
  console.log(
    JSON.stringify({
      event: event,
      context: context,
    })
  );
  if (event.body === null || event.body === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Error 400: - Invalid Request Object",
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "User Endpoint is working",
    }),
  };
};
