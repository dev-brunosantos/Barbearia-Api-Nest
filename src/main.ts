import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FormUsuario } from './middlewares/FormUsuario';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // app.use(new FormUsuario())

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
