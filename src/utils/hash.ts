import bcrypt from "bcrypt";

export const hashPass = () => {
  bcrypt.hash("121212", 10).then((hash) => console.log("hash passss", hash));
};
