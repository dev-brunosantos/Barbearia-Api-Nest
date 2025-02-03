import { PrismaModule } from './../../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ServicosService } from './servicos.service';
import { ServicosController } from './servicos.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ServicosController],
  providers: [ServicosService],
})
export class ServicosModule {}
