import { Injectable } from '@nestjs/common';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class AuthService {
    constructor(private readonly hashingService: HashingService, private readonly prisma: PrismaService) {}

    async register(body: any) {
        const hashingPassword = await this.hashingService.hash(body.password)
        return this.prisma.user.create({
            data: {
                email: body.email,
                password: hashingPassword,
                name: body.name
            }
        })
    }
}
