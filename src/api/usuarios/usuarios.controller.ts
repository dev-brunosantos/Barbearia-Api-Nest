import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    @Post()
    Criar(@Body() createUsuarioDto: CreateUsuarioDto) {
        return this.usuariosService.CadastrarUsuario(createUsuarioDto);
    }

    @Get()
    LIstar() {
        return this.usuariosService.ListarUsuarios();
    }

    @Get(':nome')
    ListarNome(@Param('nome') nome: string) {
        return this.usuariosService.UsuarioNome(nome);
    }

    @Patch(':id')
    Editar(
        @Param('id') id: string,
        @Body() updateUsuarioDto: UpdateUsuarioDto
    ) {
        return this.usuariosService.EditarUsuario(id, updateUsuarioDto);
    }

    @Delete(':id')
    Apagar(@Param('id') id: string) {
        return this.usuariosService.ExcluirUsuario(id);
    }
}
