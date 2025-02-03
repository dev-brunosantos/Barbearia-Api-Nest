import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { prismaConfig } from 'src/config/prismaConfig';
import { formatarDataISO } from 'src/functions/FormataData';
import { FormataCargo } from 'src/functions/FormataCargo';

import { PrismaService } from './../../prisma/prisma.service';

const { usuarios } = prismaConfig;

@Injectable()
export class UsuariosService {

  constructor(private prisma: PrismaService) { }

  async CadastrarUsuario(createUsuarioDto: CreateUsuarioDto) {

    const usuarioExistente = await this.prisma.usuarios.findFirst({
      where: { email: createUsuarioDto.email }
    })

    if (!usuarioExistente) {

      let cargo = FormataCargo(createUsuarioDto.tipoCargo) //TESTANDO FUNÇÃO DINAMICA PARA VALIDAR FUNÇÃO DO USUÁRIO

      const novoUsuario = this.prisma.usuarios.create({
        data: {
          nome: createUsuarioDto.nome,
          sobrenome: createUsuarioDto.sobrenome,
          email: createUsuarioDto.email,
          senha: createUsuarioDto.senha,
          cargoId: Number(cargo)
        }
      })

      return "Novo usuário cadastrado com sucesso."
    }
    throw new HttpException("O email informado já esta vinculado a outro usuário no sistema.", HttpStatus.BAD_REQUEST)
  }

  async ListarUsuarios() {
    // try {
    //   const usuariosCadastrados = await usuarios.findMany({
    //     select: {
    //       id: true,
    //       nome: true,
    //       sobrenome: true,
    //       email: true,
    //       cargo: { select: { id: true, cargo: true } },
    //       dt_criacao: true
    //     }
    //   })

    //   if (!usuariosCadastrados) {
    //     return "Não existe nenhum usuário cadastrado no sistema."
    //   }

    //   return usuariosCadastrados

    // } catch (error) {
    //   return "Erro interno. Tivemos um erro ao tentar buscar as informações dos usuários no sistema. Por favor, tente novamente."
    // }

    const usuariosCadastrados = await this.prisma.usuarios.findMany({
      select: {
        id: true,
        nome: true,
        sobrenome: true,
        email: true,
        cargo: { select: { id: true, cargo: true } },
        dt_criacao: true
      }
    })

    if (!usuariosCadastrados) {
      throw new HttpException("Nâo existe nenhum usuário cadastrado no sistema.", HttpStatus.NOT_FOUND)
    }

    return usuariosCadastrados
  }

  async UsuarioNome(nome: string) {
    // try {
    //   const nomeUsuario = await usuarios.findFirst({
    //     where: { nome: { equals: nome, mode: "insensitive" } },
    //     select: {
    //       id: true,
    //       nome: true,
    //       sobrenome: true,
    //       email: true,
    //       cargo: { select: { id: true, cargo: true } },
    //       dt_criacao: true
    //     }
    //   })

    //   if (nomeUsuario) {
    //     let dataFormatada = formatarDataISO(nomeUsuario.dt_criacao)

    //     let infor = {
    //       id: nomeUsuario.id,
    //       nome: nomeUsuario.nome,
    //       sobrenome: nomeUsuario.sobrenome,
    //       email: nomeUsuario.email,
    //       cargo: nomeUsuario.cargo.cargo,
    //       cadastro: dataFormatada
    //     }

    //     return infor
    //   }

    //   return `Não existe usuário cadastrado com o nome: ${nome}.`
    // } catch (error) {
    //   return `Erro interno. Tivemos um erro ao tentar buscar as informações do usuário ${nome} no sistema. Por favor, tente novamente.`
    // }
    const nomeUsuario = await this.prisma.usuarios.findFirst({
      where: { nome: { equals: nome, mode: "insensitive" } },
      select: {
        id: true,
        nome: true,
        sobrenome: true,
        email: true,
        cargo: { select: { id: true, cargo: true } },
        dt_criacao: true
      }
    })

    if (nomeUsuario) {
      let dataFormatada = formatarDataISO(nomeUsuario.dt_criacao)

      let infor = {
        id: nomeUsuario.id,
        nome: nomeUsuario.nome,
        sobrenome: nomeUsuario.sobrenome,
        email: nomeUsuario.email,
        cargo: nomeUsuario.cargo.cargo,
        cadastro: dataFormatada
      }

      return infor
    }

    throw new HttpException("Nâo existe nenhum usuário cadastrado no sistema com o nome informado.", HttpStatus.NOT_FOUND)
  }

  async EditarUsuario(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    try {
      const { nome, sobrenome, email, senha, tipoCargo } = updateUsuarioDto;

      const usuarioID = await usuarios.findFirst({ where: { id } })

      if (usuarioID) {

        let cargo = FormataCargo(tipoCargo) //TESTANDO FUNÇÃO DINAMICA PARA VALIDAR FUNÇÃO DO USUÁRIO

        const usuarioEditado = await usuarios.update({
          where: { id },
          data: {
            nome: nome === "" ? usuarioID.nome : nome,
            sobrenome: sobrenome === "" ? usuarioID.sobrenome : sobrenome,
            email: email === "" ? usuarioID.email : email,
            senha: senha.trim() === "" ? usuarioID.senha : senha,
            cargoId: !cargo ? usuarioID.cargoId : Number(cargo)
          }
        })

        return {
          status: "A edição foi concluída com sucesso.",
          dados_antigos: usuarioID,
          dados_atualizados: usuarioEditado
        }
      }

      return `Não foi encontrado nenhum usuário com o ID=${id}`
    } catch (error) {
      return "Erro interno. Não conseguimos realizar a consulta do usuário através do ID, por gentileza, tente novamente."
    }
  }

  async ExcluirUsuario(id: string) {
    try {
      const idUsuario = await usuarios.findFirst({ where: { id } })

      if (idUsuario) {
        await usuarios.delete({ where: { id } })
        return `Os dados do usuário ${idUsuario.nome} ${idUsuario.sobrenome} foram excluídos com sucesso.`
      }
    } catch (error) {
      return "Erro interno! Não foi possível realizar a consulta dos dados do usuário informado. Por favor, tente novamente."
    }
  }
}