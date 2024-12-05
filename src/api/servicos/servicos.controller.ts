import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicosService } from './servicos.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';

@Controller('servicos')
export class ServicosController {
  constructor(private readonly servicosService: ServicosService) {}

  @Post()
  Criar(@Body() createServicoDto: CreateServicoDto) {
    return this.servicosService.CriarServicos(createServicoDto);
  }

  @Get()
  Listar() {
    return this.servicosService.ListarServicos();
  }

  @Get(':id')
  ServicoID(@Param('id') id: string) {
    return this.servicosService.ServicoID(+id);
  }
 
  @Get(':tipo')
  ServicoNome(@Param('nome') tipo: string) {
    return this.servicosService.ServicoNome(tipo);
  }

  @Patch(':id')
  Editar(@Param('id') id: string, @Body() updateServicoDto: UpdateServicoDto) {
    return this.servicosService.EditarServico(+id, updateServicoDto);
  }

  @Delete(':id')
  Apagar(@Param('id') id: string) {
    return this.servicosService.ApagarServico(+id);
  }
}
