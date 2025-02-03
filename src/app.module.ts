import { Module } from '@nestjs/common';
import { UsuariosModule } from './api/usuarios/usuarios.module';
import { CargosModule } from './api/cargos/cargos.module';
import { ServicosModule } from './api/servicos/servicos.module';
import { AgendasModule } from './api/agendas/agendas.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UsuariosModule, CargosModule, ServicosModule, AgendasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
