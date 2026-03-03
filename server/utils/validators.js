export const validateUsername = (username) => {
  if (!username || username.trim() === "") {
    return "Username is required";
  }

  if (!/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(username)) {
    return "Username must contain only alphabets and single spaces";
  }

  return null;
};

export const validateEmail = (email) => {
  if (!email || email.trim() === "") {
    return "Email is required";
  }

  if (!/^[a-z][a-z0-9]*@gmail\.com$/.test(email)) {
    return "Invalid email format";
  }

  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return "Password is required";
  }

  if (password.includes(" ")) {
    return "Password must not contain spaces";
  }

  if (password.length < 4) {
    return "Password must be at least 4 characters";
  }

  return null;
};