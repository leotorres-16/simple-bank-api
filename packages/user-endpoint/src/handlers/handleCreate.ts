import { BasicResponse, User } from "shared/index";
import { createUser } from "../store/userStore";

export const handleCreate = async (body: string | null): Promise<BasicResponse> => {
  if (body === null || body === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "The request didn't supply all the necessary data" }),
    };
  }

  try {
    const parsedBody = JSON.parse(body);

    if (validateBody(parsedBody) === false) {
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

    const dbResponse = await createUser(user);

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

const validateBody = (body: any): boolean => {
  if (
    body.name === undefined ||
    body.name === null ||
    body.address === undefined ||
    body.address === null ||
    body.address.line1 === undefined ||
    body.address.line1 === null ||
    body.address.town === undefined ||
    body.address.town === null ||
    body.address.county === undefined ||
    body.address.county === null ||
    body.address.postcode === undefined ||
    body.address.postcode === null ||
    body.phoneNumber === undefined ||
    body.phoneNumber === null ||
    body.email === undefined ||
    body.email === null
  ) {
    return false;
  }

  // This Regex did not work for me: ^+[1-9]d{1,14}$. Using the one form this article: https://stackabuse.com/validate-phone-numbers-in-javascript-with-regular-expressions/
  const pattern = new RegExp("^\\+[1-9]{1}[0-9]{0,2}-[2-9]{1}[0-9]{2}-[2-9]{1}[0-9]{2}-[0-9]{4}$");
  if (!pattern.test(body.phoneNumber)) {
    return false;
  }

  const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  if (!emailRegex.test(body.email)) {
    return false;
  }

  return true;
};
