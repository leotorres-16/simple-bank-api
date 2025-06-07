import { BasicResponse, Session } from "shared/index";
import { fetchAccountDetails, fetchAccounts } from "../store/accountStore";

export const handleFetch = async (accountNumber: string | null, session: Session): Promise<BasicResponse> => {
  try {
    if (accountNumber === null || accountNumber === undefined) {
      const accounts = await fetchAccounts(session.userId);
      if (!accounts || accounts.length === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "No bank accounts found for the user" }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ accounts: accounts }),
      };
    }

    const accountDetails = await fetchAccountDetails(accountNumber);

    if (accountDetails && accountDetails.userId !== session.userId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: "The user is not allowed to access the bank account details" }),
      };
    }

    if (!accountDetails) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Bank account was not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(accountDetails),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "An unexpected error occurred" }),
    };
  }
};
