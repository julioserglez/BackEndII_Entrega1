import  bcrypt  from "bcrypt";

async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

async function comparePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}

export { hashPassword, comparePassword };