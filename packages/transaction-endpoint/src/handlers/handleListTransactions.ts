import { BasicResponse, Session } from "shared/index";
import { fetchTransactionsForAccount } from "../store/transactionStore";

export const handleListTransactions = async (accountNumber: string | null, session: Session): Promise<BasicResponse> => {
  if (accountNumber === null || accountNumber === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid details supplied" }),
    };
  }

  try {
    const transactions = await fetchTransactionsForAccount(accountNumber);

    if (transactions && transactions.length > 0 && transactions[0].userId !== session.userId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: "The user is not allowed to access the transaction" }),
      };
    }

    if (!transactions || transactions.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No transactions found" }),
      };
    }

    return {
      statusCode: 201,
      body: JSON.stringify(transactions),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "An unexpected error occurred" }),
    };
  }
};
