import bcrypt from "bcryptjs";

export const generateUUID = () => {
  const uuid = crypto.randomUUID();
  return uuid;
};

export const generatePasswordHash = (password: string): Promise<string> => {
  const hash = bcrypt.hash(password, 10);
  return hash;
};
