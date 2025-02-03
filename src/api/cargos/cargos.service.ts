import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { PrismaService } from './../../prisma/prisma.service';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { prismaConfig } from 'src/config/prismaConfig';

const { cargos } = prismaConfig

@Injectable()
export class CargosService {

  constructor(private prisma: PrismaService) { }

  async CriarCargo(createCargoDto: CreateCargoDto) {
    const cargoExistente = await this.prisma.cargos.findFirst({
      where: {
        cargo: {
          equals: createCargoDto.cargo,
          mode: "insensitive"
        }
      }
    })

    if (cargoExistente) {
      throw new HttpException(`O cargo ${cargoExistente.cargo.toUpperCase()} já esta cadastrado no sistema.`, HttpStatus.BAD_REQUEST)
    }

    const criar = await cargos.create({
      data: {
        cargo: createCargoDto.cargo
      }
    })

    return `O cargo ${criar.cargo.toUpperCase()} foi criado com sucesso.`

    // try {
    //   const cargoExistente = await cargos.findFirst({
    //     where: {
    //       cargo: {
    //         equals: cargo,
    //         mode: "insensitive"
    //       }
    //     }
    //   })

    //   if (cargoExistente) {
    //     return `O cargo ${cargoExistente.cargo.toUpperCase()} já esta cadastrado no sistema.`
    //   }

    //   const criar = await cargos.create({
    //     data: {
    //       cargo
    //     }
    //   })

    //   return `O cargo ${criar.cargo.toUpperCase()} foi criado com sucesso.`
    // } catch (error) {
    //   return 'Erro ao criar cargo, por favor tente novamente.'
    // }
  }

  async ListarCargos() {
    // try {
    //   const cargosCadastrados = await cargos.findMany()

    //   if (!cargosCadastrados) {
    //     return "Não existe nenhum cargo cadastrado no sistema."
    //   }

    //   return cargosCadastrados

    // } catch (error) {
    //   return 'Erro ao buscar os dados dos cargos cadastrados no sistema, por favor tente novamente.'
    // }
    const cargosCadastrados = await this.prisma.cargos.findMany()

    if (!cargosCadastrados) {
      throw new HttpException("Não existe nenhum cargo cadastrado no sistema.", HttpStatus.NOT_FOUND)
    }

    return cargosCadastrados
  }

  async BuscarCargoID(id: number) {
    // try {
    //   const cargoID = await cargos.findFirst({ where: { id } })

    //   if (cargoID) {
    //     return cargoID
    //   }

    //   return `Não existe nenhum cargo cadastrado com o ID=${id}`

    // } catch (error) {
    //   return "Não conseguimos realizar a consulta no banco de dados,por favor tente novamente."
    // }
    const cargoID = await this.prisma.cargos.findFirst({ where: { id } })

    if (cargoID) {
      return cargoID
    }
    throw new HttpException("O ID informado não esta vindulado a nenhum cargo cadastrado no sistema.", HttpStatus.NOT_FOUND)
  }

  // async BuscarCargoNome(cargo: string) {
  //   try {
  //     const cargoNome = await cargos.findFirst({ where: { cargo }})

  //     if(cargoNome) {
  //       return cargoNome
  //     }

  //     return `Não existe nenhum cargo cadastrado com o nome=${cargo}`

  //   } catch (error) {
  //     return "Não conseguimos realizar a consulta no banco de dados,por favor tente novamente."
  //   }
  // }

  async AtualizarCargo(id: number, updateCargoDto: UpdateCargoDto) {

    // const { cargo } = updateCargoDto

    // try {
    //   const idCargo = await cargos.findFirst({ where: { id } })

    //   if (cargo === idCargo.cargo) {
    //     return "O nome do cargo informado, é o mesmo que ja esta cadastrado."
    //   }

    //   if (idCargo) {
    //     const editar = await cargos.update({
    //       where: { id },
    //       data: { cargo }
    //     })

    //     return {
    //       "status": "Os dados foram atualizados com sucesso.",
    //       "dados_antigos": idCargo,
    //       "dados_atualizados": editar
    //     }
    //   }
    // } catch (error) {
    //   return `Erro ao tentar atualizar os dados do cargo com ID=${id}`
    // }
    try {
      const idCargo = await this.prisma.cargos.findFirst({ where: { id } })

      if (idCargo) {
        const editar = await cargos.update({
          where: { id },
          data: updateCargoDto
        })

        return {
          "status": "Os dados foram atualizados com sucesso.",
          "dados_antigos": idCargo,
          "dados_atualizados": editar
        }
      }

      throw new HttpException("O ID informado não esta vindulado a nenhum cargo cadastrado no sistema.", HttpStatus.NOT_FOUND)
      
    } catch (error) {
      throw new HttpException(`Erro interno! Não foi possível realizar a consulta dos dados do usuário informado. Por favor, tente novamente. \n ${error}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async ApagarCargo(id: number) {
    try {
      const cargoID = await cargos.findFirst({ where: { id } })

      if (cargoID) {
        await cargos.delete({ where: { id } })
        return "O cargo foi excluído como solicitado."
      }

      return `Não foi encontrado nenhum cargo com o ID=${id}`
    } catch (error) {
      return "Tivemos um erro ao tentar buscar os dados do cargo solicitado."
    }
  }
}
