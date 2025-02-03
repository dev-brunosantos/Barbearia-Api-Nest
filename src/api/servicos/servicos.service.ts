import { PrismaService } from './../../prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { prismaConfig } from 'src/config/prismaConfig';


const { servicos } = prismaConfig;

@Injectable()
export class ServicosService {

  constructor(private prisma: PrismaService) { }

  async CriarServicos(createServicoDto: CreateServicoDto) {
    // var { id, tipo, preco } = createServicoDto;
    // try {
    //   const servicoJaCadastrado = await servicos.findFirst({ where: { tipo } })

    //   id = Math.floor(Math.random() * 10000) + 1

    //   if (!servicoJaCadastrado) {
    //     const cadastrar = await servicos.create({
    //       data: {
    //         id, tipo, preco
    //       }
    //     })

    //     return `O serviço ${cadastrar.tipo} foi cadastrado com sucesso.`
    //   }
    // } catch (error) {
    //   return "Erro interno! Tivemos um erro ao realizar o procedimento de cadastrado. Por favor tente novamente."
    // }
    const servicoJaCadastrado = await this.prisma.servicos.findFirst({
      where: { tipo: createServicoDto.tipo }
    })

    var id = Math.floor(Math.random() * 10000) + 1

    if (!servicoJaCadastrado) {
      const cadastrar = await servicos.create({
        data: {
          id,
          tipo: createServicoDto.tipo,
          preco: createServicoDto.preco
        }
      })

      return `O serviço ${cadastrar.tipo.toUpperCase()} foi cadastrado com sucesso.`
    }
    throw new HttpException("Erro interno! Tivemos um erro ao realizar o procedimento de cadastrado. Por favor tente novamente.", HttpStatus.BAD_REQUEST)
  }

  async ListarServicos() {
    // try {
    //   const listaDeServicos = await servicos.findMany()

    //   if (listaDeServicos.length === 0) {
    //     return "Não existe nenhum serviço cadastrado no sistema."
    //   }

    //   return listaDeServicos
    // } catch (error) {
    //   return "Erro interno! Não conseguimos realizar a consulta dos serviços no sistema. Por favor, tente novamente."
    // }
    const listaDeServicos = await this.prisma.servicos.findMany()

    if (listaDeServicos.length === 0) {
      throw new HttpException("Não existe nenhum serviço cadastrado no sistema.", HttpStatus.NOT_FOUND)
    }

    return listaDeServicos
  }

  async ServicoID(id: number) {
    // try {
    //   const idServico = await servicos.findFirst({ where: { id } })

    //   if (!idServico) {
    //     return `Não existe nenhum serviço com o ID=${id} que foi informado.`
    //   }

    //   return idServico

    // } catch (error) {
    //   return "Erro interno! Não conseguimos realizar a consulta dos serviços no sistema. Por favor, tente novamente."
    // }
      const idServico = await this.prisma.servicos.findFirst({ where: { id } })

      if (!idServico) {
        throw new HttpException(`Não existe nenhum serviço com o ID=${id} que foi informado.`, HttpStatus.NOT_FOUND)
      }

      return idServico
  }

  async ServicoNome(tipo: string) {
    try {
      const nomeServico = await servicos.findMany({
        where: {
          tipo: {
            contains: tipo,
            mode: 'insensitive'
          }
        }
      })

      if (!nomeServico) {
        return `Não existe nenhum serviço com o nome ${tipo} cadastrado no sistema.`
      }

      console.log(tipo)

      return nomeServico

    } catch (error) {
      return "Erro interno! Não conseguimos realizar a consulta dos serviços no sistema. Por favor, tente novamente."
    }
  }

  async EditarServico(id: number, updateServicoDto: UpdateServicoDto) {
    // try {
    //   const { tipo, preco } = updateServicoDto;

    //   const servicoId = await servicos.findFirst({ where: { id } })

    //   if (servicoId) {
    //     const editado = await servicos.update({
    //       where: { id },
    //       data: {
    //         tipo: tipo.trim() === "" ? servicoId.tipo : tipo,
    //         preco: preco === 0 ? servicoId.preco : preco
    //       }
    //     })

    //     return {
    //       status: "Os dados foram atualizados com sucesso.",
    //       dados_antigos: servicoId,
    //       dados_atualizados: editado
    //     }
    //   }

    //   return "Não existe nenhum serviço com o ID informado."
    // } catch (error) {
    //   return "Erro interno! Não conseguimos realizar a consulta dos serviços no sistema para realizar as atualizações dos dados. Por favor, tente novamente."
    // }
    try {
      const servicoId = await this.prisma.servicos.findFirst({ where: { id } })

      if (servicoId) {
        const editado = await servicos.update({
          where: { id },
          data: {
            tipo: updateServicoDto.tipo.trim() === "" ? servicoId.tipo : updateServicoDto.tipo,
            preco: updateServicoDto.preco === 0 ? servicoId.preco : updateServicoDto.preco
          }
        })

        return {
          status: "Os dados foram atualizados com sucesso.",
          dados_antigos: servicoId,
          dados_atualizados: editado
        }
      }

      throw new HttpException(`Não existe nenhum serviço com o ID=${id} que foi informado.`, HttpStatus.NOT_FOUND)

    } catch (error) {
      throw new HttpException("Erro interno! Não conseguimos realizar a consulta dos serviços no sistema para realizar as atualizações dos dados. Por favor, tente novamente.", HttpStatus.NOT_FOUND)
    }
  }

  async ApagarServico(id: number) {
  //   try {
  //     const idServidoExistente = await servicos.findFirst({ where: { id } })
  //     if (idServidoExistente) {
  //       await servicos.delete({ where: { id } })
  //       return `Os dados do servico ${idServidoExistente.tipo} foram excluídos com sucesso.`
  //     }

  //     return `Não foi encontrado nenhum servico com o ID=${id}`
  //   } catch (error) {
  //     return "Erro interno! Por favor, tente novamente."
  //   }
  // }
    try {
      const idServidoExistente = await this.prisma.servicos.findFirst({ where: { id } })
      if (idServidoExistente) {
        await servicos.delete({ where: { id } })
        return `Os dados do servico ${idServidoExistente.tipo.toUpperCase()} foram excluídos com sucesso.`
      }

      throw new HttpException(`Não existe nenhum serviço com o ID=${id} que foi informado.`, HttpStatus.NOT_FOUND)

    } catch (error) {
      throw new HttpException("Erro interno! Não conseguimos realizar a consulta dos serviços no sistema para realizar as atualizações dos dados. Por favor, tente novamente.", HttpStatus.NOT_FOUND)
    }
  }
}
