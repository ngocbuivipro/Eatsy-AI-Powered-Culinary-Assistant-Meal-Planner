import bcrypt from "bcryptjs";
import { validateRegisterInput } from "./user.validation.js";
import { findUserByEmail, createUser } from "./user.repository.js";

const registerUser = async (userData) => {
  const validationError = validateRegisterInput(userData);
  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  const name = userData.name.trim();
  const email = userData.email.toLowerCase().trim();
  const { password } = userData;

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const error = new Error("Email already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await createUser({
    name,
    email,
    password: hashedPassword,
    authProvider: "local",
  });

  return {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    authProvider: newUser.authProvider,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  };
};

export { registerUser };
