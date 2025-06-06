import { BasicResponse, Session } from "shared/index";
import { fetchUser } from "../store/userStore";

export const handleFetch = async (userId: string | null, session: Session): Promise<BasicResponse> => {
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

  const user = await fetchUser(userId);

  if (!user) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "User was not found" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(user),
  };
};
