import { Injectable } from '@nestjs/common';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { prismaConfig } from 'src/config/prismaConfig';


const { servicos } = prismaConfig;

@Injectable()
export class ServicosService {
  async CriarServicos(createServicoDto: CreateServicoDto) {
    var { id, tipo, preco } = createServicoDto;
    try {
      const servicoJaCadastrado = await servicos.findFirst({ where: { tipo } })

      id = Math.floor(Math.random() * 10000) + 1

      if (id === servicoJaCadastrado.id) {
        id = servicoJaCadastrado.id * 2
      }

      if (!servicoJaCadastrado) {
        const cadastrar = await servicos.create({
          data: {
            id, tipo, preco
          }
        })

        return `O serviço ${cadastrar.tipo} foi cadastrado com sucesso.`
      }
    } catch (error) {
      return "Erro interno! Tivemos um erro ao realizar o procedimento de cadastrado. Por favor tente novamente."
    }
  }

  async ListarServicos() {
    try {
      const listaDeServicos = await servicos.findMany()

      if (!listaDeServicos) {
        return "Não existe nenhum serviço cadastrado no sistema."
      }

      return listaDeServicos
    } catch (error) {
      return "Erro interno! Não conseguimos realizar a consulta dos serviços no sistema. Por favor, tente novamente."
    }
  }

  async ServicoID(id: number) {
    try {
      const idServico = await servicos.findFirst({ where: { id } })

      if (!idServico) {
        return `Não existe nenhum serviço com o ID=${id} que foi informado.`
      }

      return idServico

    } catch (error) {
      return "Erro interno! Não conseguimos realizar a consulta dos serviços no sistema. Por favor, tente novamente."
    }
  }

  async ServicoNome(tipo: string) {
    try {
      const nomeServico = await servicos.findFirst({ where: { tipo } })

      if (!nomeServico) {
        return `Não existe nenhum serviço com o nome ${tipo} cadastrado no sistema.`
      }

      return nomeServico

    } catch (error) {
      return "Erro interno! Não conseguimos realizar a consulta dos serviços no sistema. Por favor, tente novamente."
    }
  }

  async EditarServico(id: number, updateServicoDto: UpdateServicoDto) {
    try {
      const { tipo, preco } = updateServicoDto;

      const servicoId = await servicos.findFirst({ where: { id } })

      if(servicoId) {
        const editado = await servicos.update({
          where: {id},
          data: {
            tipo: tipo.trim() === "" ? servicoId.tipo : tipo,
            preco: preco === 0 ? servicoId.preco : preco
          }
        })

        return {
          status: "Os dados foram atualizados com sucesso.",
          dados_antigos: servicoId,
          dados_atualizados: editado
        }
      }
    } catch (error) {
      return "Erro interno! Não conseguimos realizar a consulta dos serviços no sistema para realizar as atualizações dos dados. Por favor, tente novamente."
    }
  }

  async Apagar(id: number) {
    try {
      const idServidoExistente = await servicos.findFirst({ where: { id }})
      if(idServidoExistente) {
        await servicos.delete({ where: { id }})
        return `Os dados do servico ${idServidoExistente.tipo} foram excluídos com sucesso.`
      } 

      return `Não foi encontrado nenhum servico com o ID=${id}`
    } catch (error) {
      return "Erro interno! Por favor, tente novamente."
    }
  }
}
