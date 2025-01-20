import * as bcrypt from 'bcryptjs';

export class Encrypt {
  static async createHash(plainPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(plainPassword, salt);
  }

  static isSameAsHash(hashedToken: string, plainPassword: string): boolean {
    return bcrypt.compareSync(plainPassword, hashedToken);
  }
}
