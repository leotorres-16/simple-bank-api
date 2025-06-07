import { BasicResponse, Session, User } from "shared/index";
import { createOrUpdateUser, fetchUser } from "../store/userStore";
import { validateUserBody } from "../helpers/validateUserBody";
import { validateUserId } from "../helpers/validateUserId";

export const handleUpdate = async (body: string | null, userId: string | null, session: Session): Promise<BasicResponse> => {
  const validationError = validateUserId(userId, session);

  if (validationError) {
    return validationError;
  }

  const oldUser = await fetchUser(userId as string);

  if (!oldUser) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "User was not found" }),
    };
  }
  if (body === null || body === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "The request didn't supply all the necessary data" }),
    };
  }

  try {
    const parsedBody = JSON.parse(body);

    if (validateUserBody(parsedBody) === false) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "The request didn't supply all the necessary data" }),
      };
    }

    // Update user object with new data
    const newUser: User = { ...oldUser };
    const changes: String[] = [];

    if (parsedBody.name && parsedBody.name !== oldUser.name) {
      newUser.name = parsedBody.name;
      changes.push("name");
    }
    if (parsedBody.address && JSON.stringify(parsedBody.address) !== JSON.stringify(oldUser.address)) {
      newUser.address = {
        line1: parsedBody.address.line1,
        line2: parsedBody.address.line2 || "",
        line3: parsedBody.address.line3 || "",
        town: parsedBody.address.town,
        county: parsedBody.address.county,
        postcode: parsedBody.address.postcode,
      };
      changes.push("address");
    }
    if (parsedBody.phoneNumber && parsedBody.phoneNumber !== oldUser.phoneNumber) {
      newUser.phoneNumber = parsedBody.phoneNumber;
      changes.push("phoneNumber");
    }
    if (parsedBody.email && parsedBody.email !== oldUser.email) {
      newUser.email = parsedBody.email;
      changes.push("email");
    }

    newUser.updatedTimestamp = new Date().toISOString();

    const dbResponse = await createOrUpdateUser(newUser);

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
