import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { HashingService } from './services/hashing.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from './guards/access-token.guard';
import { APIKeyGuard } from './guards/api-key.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/authentication.guard';

const shareServices = [PrismaService, HashingService, TokenService];

@Global()
@Module({
    imports:[JwtModule],
    providers: [...shareServices, AccessTokenGuard, APIKeyGuard, {
        provide: APP_GUARD,
        useClass: AuthenticationGuard
    }],
    exports: shareServices
})
export class SharedModule {}
