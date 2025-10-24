import jwt from "jsonwebtoken";

const JwtDecode = (token) => {
  try {
    const token_decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return token_decode;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

export { JwtDecode };
