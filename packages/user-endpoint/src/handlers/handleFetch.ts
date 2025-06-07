import { BasicResponse, Session } from "shared/index";
import { fetchUser } from "../store/userStore";
import { validateUserId } from "../helpers/validateUserId";

export const handleFetch = async (userId: string | null, session: Session): Promise<BasicResponse> => {
  const validationError = validateUserId(userId, session);

  if (validationError) {
    return validationError;
  }

  const user = await fetchUser(userId as string);

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
