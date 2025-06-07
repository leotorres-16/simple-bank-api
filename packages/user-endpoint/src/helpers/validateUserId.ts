import { BasicResponse, Session } from "shared/index";

export const validateUserId = (userId: string | null, session: Session): BasicResponse | null => {
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

  if (userId !== session.urserId) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "The user is not allowed to access the transaction" }),
    };
  }

  return null; // No validation errors, return null
};
