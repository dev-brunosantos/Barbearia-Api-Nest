import { Cargos } from './../../../node_modules/.prisma/client/index.d';
import { Injectable } from '@nestjs/common';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { prismaConfig } from 'src/config/prismaConfig';

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

  async ListarCargos() {
    try {
      const cargosCadastrados = await cargos.findMany()

      if (!cargosCadastrados) {
        return "Não existe nenhum cargo cadastrado no sistema."
      }

      return cargosCadastrados

    } catch (error) {
      return 'Erro ao buscar os dados dos cargos cadastrados no sistema, por favor tente novamente.'
    }
  }

  async BuscarCargoID(id: number) {
    try {
      const cargoID = await cargos.findFirst({ where: { id } })

      if (cargoID) {
        return cargoID
      }

      return `Não existe nenhum cargo cadastrado com o ID=${id}`

    } catch (error) {
      return "Não conseguimos realizar a consulta no banco de dados,por favor tente novamente."
    }
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

    const { cargo } = updateCargoDto

    try {
      const idCargo = await cargos.findFirst({ where: { id } })

      if(cargo === idCargo.cargo) {
        return "O nome do cargo informado, é o mesmo que ja esta cadastrado."
      }

      if (idCargo) {
        const editar = await cargos.update({
          where: { id },
          data: { cargo }
        })

        return {
          "status":"Os dados foram atualizados com sucesso.",
          "dados_antigos": idCargo,
          "dados_atualizados": editar
        }
      }
    } catch (error) {
      return `Erro ao tentar atualizar os dados do cargo com ID=${id}`
    }
  }

  async ApagarCargo(id: number) {
    try {
      const cargoID = await cargos.findFirst({where: {id}})

      if(cargoID) {
        await cargos.delete({ where: {id}})
        return "O cargo foi excluído como solicitado."
      }

      return `Não foi encontrado nenhum cargo com o ID=${id}`
    } catch (error) {
      return "Tivemos um erro ao tentar buscar os dados do cargo solicitado."
    }
  }
}
