import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{
    constructor() {
        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect()
    }
}
