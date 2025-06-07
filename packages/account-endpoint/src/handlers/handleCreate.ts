import { BasicResponse } from "shared/index";
import { createAccount } from "../store/accountStore";
import { validateAccountBody } from "../helpers/validateAccountBody";

export const handleCreate = async (body: string | null): Promise<BasicResponse> => {
  if (body === null || body === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid details supplied" }),
    };
  }

  try {
    const parsedBody = JSON.parse(body);

    if (validateAccountBody(parsedBody) === false) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid details supplied" }),
      };
    }

    const dbResponse = await createAccount(parsedBody.name, parsedBody.accountType);

    if (dbResponse === null) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "An unexpected error occurred" }),
      };
    }

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Bank Account has been created successfully", account: dbResponse }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "An unexpected error occurred" }),
    };
  }
};
