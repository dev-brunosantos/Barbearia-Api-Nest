import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { prismaConfig } from 'src/config/prismaConfig';

const { usuarios } = prismaConfig;

@Injectable()
export class UsuariosService {
  async CadastrarUsuario(createUsuarioDto: CreateUsuarioDto) {
    const { nome, sobrenome, email, senha, tipoCargo } = createUsuarioDto

    var cargo = 0;

    try {
      const usuarioExistente = await usuarios.findFirst({ where: { email } })

      if (!usuarioExistente) {
        switch (tipoCargo) {
          case "Desenvolvedor":
            cargo = 3
            break;
          case "Cliente":
            cargo = 4
            break;
          case "Profissional":
            cargo = 5
            break;
          default:
            return "Cargo inválido ou não encontrado."
        }

        const cadastrar = await usuarios.create({
          data: { nome, sobrenome, email, senha, cargoId: cargo }
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
        const [ano, mes, dia] = nomeUsuario.dt_criacao.toISOString().slice(0, 10).split("-")

        const dataFormatada = `${dia}/${mes}/${ano}`

        const infor = {
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

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
