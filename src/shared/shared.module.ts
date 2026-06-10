import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { HashingService } from './services/hashing.service';

const shareServices = [PrismaService, HashingService];

@Global()
@Module({
    providers: shareServices,
    exports: shareServices
})
export class SharedModule {}
