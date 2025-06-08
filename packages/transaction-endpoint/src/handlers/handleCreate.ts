import { BasicResponse, Session, Transaction, TransactionType } from "shared/index";
import { validateTransactionBody } from "../helpers/validateTransactionBody";
import { createTransaction, fetchAccountDetails } from "../store/transactionStore";

export const handleCreate = async (body: string | null, accountNumber: string | null, session: Session): Promise<BasicResponse> => {
  if (body === null || body === undefined || accountNumber === null || accountNumber === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid details supplied" }),
    };
  }

  try {
    const parsedBody = JSON.parse(body);

    if (validateTransactionBody(parsedBody) === false) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid details supplied" }),
      };
    }

    const accountDetails = await fetchAccountDetails(accountNumber);

    if (accountDetails && accountDetails.userId !== session.userId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: "The user is not allowed to access the transaction" }),
      };
    }

    if (!accountDetails) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Bank account was not found" }),
      };
    }

    const newTransaction: Transaction = {
      transactionId: `tan-${accountNumber}123`,
      userId: session.userId,
      accountNumber,
      amount: parsedBody.amount,
      currency: parsedBody.currency,
      type: parsedBody.type,
      createdTimestamp: new Date().toISOString(),
      updatedTimestamp: new Date().toISOString(),
    };

    if (newTransaction.type === TransactionType.WITHDRAWAL && newTransaction.amount > accountDetails.balance) {
      return {
        statusCode: 422,
        body: JSON.stringify({ message: "Insufficient funds to process transaction" }),
      };
    }

    const dbResponse = await createTransaction(newTransaction);

    if (dbResponse === false) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "An unexpected error occurred" }),
      };
    }

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Transaction has been created successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "An unexpected error occurred" }),
    };
  }
};
