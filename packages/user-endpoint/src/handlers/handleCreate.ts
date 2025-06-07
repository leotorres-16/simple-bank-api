import { BasicResponse, User } from "shared/index";
import { createOrUpdateUser } from "../store/userStore";
import { validateUserBody } from "../helpers/validateUserBody";

export const handleCreate = async (body: string | null): Promise<BasicResponse> => {
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

    const user: User = {
      id: `usr-${parsedBody.name.toLowerCase().replace(/\s+/g, "-")}`,
      name: parsedBody.name,
      address: {
        line1: parsedBody.address.line1,
        line2: parsedBody.address.line2 || "",
        line3: parsedBody.address.line3 || "",
        town: parsedBody.address.town,
        county: parsedBody.address.county,
        postcode: parsedBody.address.postcode,
      },
      phoneNumber: parsedBody.phoneNumber,
      email: parsedBody.email,
      createdTimestamp: new Date().toISOString(),
      updatedTimestamp: new Date().toISOString(),
    };

    const dbResponse = await createOrUpdateUser(user);

    if (dbResponse === false) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "An unexpected error occurred" }),
      };
    }

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "User has been created successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "An unexpected error occurred" }),
    };
  }
};
