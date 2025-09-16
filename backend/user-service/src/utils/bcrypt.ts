import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const saltRounds = bcrypt.genSaltSync(10);

// Hashing Password
const generateBcryptPassword = async (password: string) => {
  return await bcrypt.hashSync(password, saltRounds);
};

// Validate Password
const validateBcryptPassword = async (userPassword: string, dbPassword: string) => {
  return await bcrypt.compareSync(userPassword, dbPassword);
};

// Generate random string //TODO : make it more secure WITH MODULES
const generateRandomString = (length: number) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const generateJWTToken = (data: Object, expiry: string, key: string) => {
  // GENERATE TOKEN
  return jwt.sign(data, key);
};

export default { generateBcryptPassword, validateBcryptPassword, generateRandomString, generateJWTToken };
