import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete
} from '@nestjs/common';
import { CargosService } from './cargos.service';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';

@Controller('cargos')
export class CargosController {
    constructor(private readonly cargosService: CargosService) {}

    @Post()
    Criar(@Body() createCargoDto: CreateCargoDto) {
        return this.cargosService.CriarCargo(createCargoDto);
    }

    @Get()
    Listar() {
        return this.cargosService.ListarCargos();
    }

    @Get(':id')
    CargoId(@Param('id') id: number) {
        return this.cargosService.BuscarCargoID(+id);
    }

    // @Get(':cargo')
    // CargoNome(@Param('cargo') cargo: string) {
    //   return this.cargosService.BuscarCargoNome(cargo);
    // }

    @Patch(':id')
    Atualizar(@Param('id') id: string, @Body() updateCargoDto: UpdateCargoDto) {
        return this.cargosService.AtualizarCargo(+id, updateCargoDto);
    }

    @Delete(':id')
    Apagar(@Param('id') id: string) {
        return this.cargosService.ApagarCargo(+id);
    }
}
