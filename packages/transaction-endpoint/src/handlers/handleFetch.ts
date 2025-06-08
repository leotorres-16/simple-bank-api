import { BasicResponse, Session } from "shared/index";
import { fetchTransactionById } from "../store/transactionStore";

export const handleFetch = async (accountNumber: string | null, transactionId: string | null, session: Session): Promise<BasicResponse> => {
  if (accountNumber === null || accountNumber === undefined || transactionId === null || transactionId === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid details supplied" }),
    };
  }

  try {
    const transaction = await fetchTransactionById(transactionId);

    if (transaction && transaction.userId !== session.userId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: "The user is not allowed to access the transaction" }),
      };
    }

    if (!transaction) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No transactions found" }),
      };
    }

    if (transaction.accountNumber !== accountNumber) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: "The user is not allowed to access the transaction" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(transaction),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "An unexpected error occurred" }),
    };
  }
};
