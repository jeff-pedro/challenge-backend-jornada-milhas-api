import { Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingPassword implements PipeTransform {
    constructor(private readonly configService: ConfigService) {}

    async transform(password: string) {
        const salt = this.configService.get<string>('HASH_SALT');
        const hashedPassword = await bcrypt.hash(password, salt!);
        return hashedPassword;
    }
}