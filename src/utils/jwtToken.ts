import jwt from "jsonwebtoken";

const createToken = (user: object, expires: string) => {
  return jwt.sign({ user }, process.env.JWT_SECRET as string, {
    expiresIn: expires,
  });
};

export default createToken;
