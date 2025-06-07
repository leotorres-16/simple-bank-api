import { BasicResponse, Session } from "shared/index";
import { deleteAccount, fetchAccountDetails } from "../store/accountStore";

export const handleDelete = async (accountId: string | null, session: Session): Promise<BasicResponse> => {
  if (accountId === null || accountId === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "The request didn't supply all the necessary data" }),
    };
  }

  try {
    const accountDetails = await fetchAccountDetails(accountId);

    if (!accountDetails) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Bank account was not found" }),
      };
    }

    if (accountDetails.userId !== session.userId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: "The user is not allowed to delete the bank account details" }),
      };
    }

    const dbResponse = await deleteAccount(accountId);

    if (dbResponse === false) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "An unexpected error occurred" }),
      };
    }

    return {
      statusCode: 204,
      body: JSON.stringify({ message: "The user has been deleted" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "An unexpected error occurred" }),
    };
  }
};
