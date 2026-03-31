import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class Encrypter {
  private algorithm = 'aes-256-cbc';
  private key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  private static instance: Encrypter | undefined;

  public static getInstance(): Encrypter {
    if (!Encrypter.instance) {
      Encrypter.instance = new Encrypter();
    }
    return Encrypter.instance;
  }

  encrypt(textToBeEncrypted: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(textToBeEncrypted, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  decrypt(textToBeDecrypted: string): string {
    const [ivHex, encryptedText] = textToBeDecrypted.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedTextBuffer = Buffer.from(encryptedText, 'hex');

    const decipher: any = createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(encryptedTextBuffer, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  verifyValue(envKey: string, encryptedKey: string) {
    try {
      const decryptedValue = this.decrypt(encryptedKey);
      return envKey === decryptedValue;
    } catch (err) {
      return false;
    }
  }
}
