import { BasicResponse, Session } from "shared/index";
import { deleteUser, fetchUser } from "../store/userStore";

export const handleDelete = async (userId: string | null, session: Session): Promise<BasicResponse> => {
  if (userId === null || userId === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "The request didn't supply all the necessary data" }),
    };
  }
  let exactMatch = new RegExp("^usr-[A-Za-z0-9]+$");
  if (!exactMatch.test(userId)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "The request didn't supply all the necessary data" }),
    };
  }

  try {
    const user = await fetchUser(userId);

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User was not found" }),
      };
    }

    if (user.id !== session.urserId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: "The user is not allowed to access the transaction" }),
      };
    }

    if (user.bankAccounts?.length && user.bankAccounts.length > 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: "A user cannot be deleted when they are associated with a bank account" }),
      };
    }

    const dbResponse = await deleteUser(userId);

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
