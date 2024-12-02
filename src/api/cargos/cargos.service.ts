import { Cargos } from './../../../node_modules/.prisma/client/index.d';
import { Injectable } from '@nestjs/common';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { prismaConfig } from 'src/config/prismaConfig';
import { Cargo } from './entities/cargo.entity';

const { cargos } = prismaConfig

@Injectable()
export class CargosService {
  async CriarCargo(createCargoDto: CreateCargoDto) {

    const { cargo } = createCargoDto

    try {
      const cargoExistente = await cargos.findFirst({
        where: {
          cargo: {
            equals: cargo,
            mode: "insensitive"
          }
        }
      })

      if (cargoExistente) {
        return `O cargo ${cargoExistente.cargo.toUpperCase()} já esta cadastrado no sistema.`
      }

      const criar = await cargos.create({
        data: {
          cargo
        }
      })

      return `O cargo ${criar.cargo.toUpperCase()} foi criado com sucesso.`
    } catch (error) {
      return 'Erro ao criar cargo, por favor tente novamente.'
    }
  }

  findAll() {
    return `This action returns all cargos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cargo`;
  }

  update(id: number, updateCargoDto: UpdateCargoDto) {
    return `This action updates a #${id} cargo`;
  }

  remove(id: number) {
    return `This action removes a #${id} cargo`;
  }
}
