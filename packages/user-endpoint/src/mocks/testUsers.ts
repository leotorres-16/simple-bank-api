import { User } from "shared/index";

export const testUser: User = {
  id: "usr-123",
  name: "John Doe",
  address: {
    line1: "123 Main St",
    line2: "Apt 4B",
    line3: "",
    town: "Springfield",
    county: "IL",
    postcode: "62701",
  },
  phoneNumber: "555-1234",
  email: "test@email.com",
  createdTimestamp: "",
  updatedTimestamp: "",
};
