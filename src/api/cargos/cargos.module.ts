import { PrismaModule } from './../../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { CargosService } from './cargos.service';
import { CargosController } from './cargos.controller';

@Module({
    imports: [PrismaModule],
    controllers: [CargosController],
    providers: [CargosService]
})
export class CargosModule {}
