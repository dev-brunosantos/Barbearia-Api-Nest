import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { prismaConfig } from 'src/config/prismaConfig';
import { formatarDataISO } from 'src/functions/FormataData';
import { FormataCargo } from 'src/functions/FormataCargo';

const { usuarios } = prismaConfig;

@Injectable()
export class UsuariosService {
  async CadastrarUsuario(createUsuarioDto: CreateUsuarioDto) {
    const { nome, sobrenome, email, senha, tipoCargo } = createUsuarioDto

    // var cargo = 0;

    try {
      const usuarioExistente = await usuarios.findFirst({ where: { email } })

      if (!usuarioExistente) {
        let cargo = FormataCargo(tipoCargo) //TESTANDO FUNÇÃO DINAMICA PARA VALIDAR FUNÇÃO DO USUÁRIO

        const cadastrar = await usuarios.create({
          data: { nome, sobrenome, email, senha, cargoId: Number(cargo) }
        })

        return `Usuário(a) ${cadastrar.nome.toUpperCase()} ${cadastrar.sobrenome.toUpperCase()} foi cadastrado com sucesso.`
      }
    } catch (error) {
      return "Erro interno. Tivemos um erro ao tentar cadastar um novo usuário no sistema. Por favor, tente novamente."
    }
  }

  async ListarUsuarios() {
    try {
      const usuariosCadastrados = await usuarios.findMany({
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
        return "Não existe nenhum usuário cadastrado no sistema."
      }

      return usuariosCadastrados

    } catch (error) {
      return "Erro interno. Tivemos um erro ao tentar buscar as informações dos usuários no sistema. Por favor, tente novamente."
    }
  }

  async UsuarioNome(nome: string) {
    try {
      const nomeUsuario = await usuarios.findFirst({
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

      return `Não existe usuário cadastrado com o nome: ${nome}.`
    } catch (error) {
      return `Erro interno. Tivemos um erro ao tentar buscar as informações do usuário ${nome} no sistema. Por favor, tente novamente.`
    }
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
      const idUsuario = await usuarios.findFirst({ where: { id }})
      
      if(idUsuario) {
        await usuarios.delete({ where: {id}})
        return `Os dados do usuário ${idUsuario.nome} ${idUsuario.sobrenome} foram excluídos com sucesso.`
      }
    } catch (error) {
      return "Erro interno! Não foi possível realizar a consulta dos dados do usuário informado. Por favor, tente novamente."
    }
  }
}
