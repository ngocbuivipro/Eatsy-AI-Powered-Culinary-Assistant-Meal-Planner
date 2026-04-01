import User from "./user.model.js";

const findUserByEmail = async (email) => {
  return User.findOne({ email: email.toLowerCase().trim() });
};

const createUser = async (userData) => {
  return User.create(userData);
};

export { findUserByEmail, createUser };
