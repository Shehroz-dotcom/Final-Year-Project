import jwt from "jsonwebtoken";

const JwtDecode = (token , secret) => {
  try {
    const token_decode = jwt.verify(token, secret);
    return token_decode;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

export { JwtDecode };
