import { Account, BasicResponse, Session } from "shared/index";
import { fetchAccountDetails, updateAccountDetails } from "../store/accountStore";
import { validateAccountBody } from "../helpers/validateAccountBody";

export const handleUpdate = async (body: string | null, accountNumber: string | null, session: Session): Promise<BasicResponse> => {
  if (body === null || body === undefined || accountNumber === null || accountNumber === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "The request didn't supply all the necessary data" }),
    };
  }

  const oldAccount = await fetchAccountDetails(accountNumber as string);

  if (oldAccount && oldAccount.userId !== session.userId) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "The user is not allowed to update the bank account details" }),
    };
  }

  if (!oldAccount) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Bank account was not found" }),
    };
  }

  try {
    const parsedBody = JSON.parse(body);

    if (validateAccountBody(parsedBody) === false) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "The request didn't supply all the necessary data" }),
      };
    }

    // Update user object with new data
    const newAccount: Account = { ...oldAccount };
    const changes: String[] = [];

    if (parsedBody.name && parsedBody.name !== oldAccount.name) {
      newAccount.name = parsedBody.name;
      changes.push("name");
    }
    if (parsedBody.accountType && parsedBody.accountType !== oldAccount.accountType) {
      newAccount.accountType = parsedBody.accountType;
      changes.push("accountType");
    }

    newAccount.updatedTimestamp = new Date().toISOString();

    const dbResponse = await updateAccountDetails(newAccount);

    if (dbResponse === false) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "An unexpected error occurred" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Updated ${changes.join(",")}` }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "An unexpected error occurred" }),
    };
  }
};
