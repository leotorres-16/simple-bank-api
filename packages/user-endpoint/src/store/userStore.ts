import { User } from "shared/index";

export const fetchUser = async (userId: string): Promise<User | null> => {
  // Simulate fetching user data from a database or external service
  const user: User = {
    id: userId,
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
  return user;
};

export const createUser = async (user: User): Promise<boolean> => {
  // Simulate creating a user in a database or external service
  console.log("User created:", user);
  return true; // Return true to indicate success
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  // Simulate deleting a user from a database or external service
  console.log("User deleted:", userId);
  return true; // Return null to indicate the user was deleted
};
