import bcrypt from "bcryptjs";

export class HashManager {
  public hash = async (password: string) => {
    const rounds = Number(process.env.BCRYPT_SALT_ROUNDS);
    const salt = await bcrypt.genSalt(rounds);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  };

  public compare = async (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
  };
}
