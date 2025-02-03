import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        const prismaClient = await this.$connect()
        return prismaClient;
    }
    
    async onModuleDestroy() {
        const prismaClient = await this.$connect()
        return prismaClient;
    }
}
