const validateRegisterInput = (data = {}) => {
  const { name, email, password } = data;

  if (!name || !email || !password) {
    return "Name, email, and password are required";
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return "Name must be at least 2 characters";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof email !== "string" || !emailRegex.test(email)) {
    return "Invalid email format";
  }

  if (typeof password !== "string" || password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
};

export { validateRegisterInput };
