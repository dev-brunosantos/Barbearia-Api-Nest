import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicosService } from './servicos.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';

@Controller('servicos')
export class ServicosController {
  constructor(private readonly servicosService: ServicosService) {}

  @Post()
  create(@Body() createServicoDto: CreateServicoDto) {
    return this.servicosService.CriarServicos(createServicoDto);
  }

  @Get()
  findAll() {
    return this.servicosService.ListarServicos();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicosService.ServicoID(+id);
  }
 
  @Get(':nome')
  ServicoNome(@Param('nome') nome: string) {
    return this.servicosService.ServicoNome(nome);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServicoDto: UpdateServicoDto) {
    return this.servicosService.EditarServico(+id, updateServicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicosService.ApagarServico(+id);
  }
}
