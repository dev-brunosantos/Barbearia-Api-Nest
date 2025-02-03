import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from './../../prisma/prisma.service';
import { formatarDataISO } from 'src/functions/FormataData';
import { FormataCargo } from 'src/functions/FormataCargo';

@Injectable()
export class UsuariosService {
    constructor(private prisma: PrismaService) {}

    async CadastrarUsuario(createUsuarioDto: CreateUsuarioDto) {
        const usuarioExistente = await this.prisma.usuarios.findFirst({
            where: { email: createUsuarioDto.email }
        });

        if (!usuarioExistente) {
            let cargo = FormataCargo(createUsuarioDto.tipoCargo); //TESTANDO FUNÇÃO DINAMICA PARA VALIDAR FUNÇÃO DO USUÁRIO

            const novoUsuario = await this.prisma.usuarios.create({
                data: {
                    nome: createUsuarioDto.nome,
                    sobrenome: createUsuarioDto.sobrenome,
                    email: createUsuarioDto.email,
                    senha: createUsuarioDto.senha,
                    cargoId: Number(cargo)
                }
            });

            return `O usuário ${novoUsuario.nome.toUpperCase()} ${novoUsuario.sobrenome.toUpperCase()} foi cadastrado com sucesso.`;
        }
        throw new HttpException(
            'O email informado já esta vinculado a outro usuário no sistema.',
            HttpStatus.BAD_REQUEST
        );
    }

    async ListarUsuarios() {
        const usuariosCadastrados = await this.prisma.usuarios.findMany({
            select: {
                id: true,
                nome: true,
                sobrenome: true,
                email: true,
                cargo: { select: { id: true, cargo: true } },
                dt_criacao: true
            }
        });

        if (!usuariosCadastrados) {
            throw new HttpException(
                'Nâo existe nenhum usuário cadastrado no sistema.',
                HttpStatus.NOT_FOUND
            );
        }

        return usuariosCadastrados;
    }

    async UsuarioNome(nome: string) {
        const nomeUsuario = await this.prisma.usuarios.findFirst({
            where: { nome: { equals: nome, mode: 'insensitive' } },
            select: {
                id: true,
                nome: true,
                sobrenome: true,
                email: true,
                cargo: { select: { id: true, cargo: true } },
                dt_criacao: true
            }
        });

        if (nomeUsuario) {
            let dataFormatada = formatarDataISO(nomeUsuario.dt_criacao);

            let infor = {
                id: nomeUsuario.id,
                nome: nomeUsuario.nome,
                sobrenome: nomeUsuario.sobrenome,
                email: nomeUsuario.email,
                cargo: nomeUsuario.cargo.cargo,
                cadastro: dataFormatada
            };

            return infor;
        }

        throw new HttpException(
            'Nâo existe nenhum usuário cadastrado no sistema com o nome informado.',
            HttpStatus.NOT_FOUND
        );
    }

    async EditarUsuario(id: string, updateUsuarioDto: UpdateUsuarioDto) {
        try {
            const usuarioID = await this.prisma.usuarios.findFirst({
                where: { id }
            });

            if (usuarioID) {
                let cargo = FormataCargo(updateUsuarioDto.tipoCargo); //TESTANDO FUNÇÃO DINAMICA PARA VALIDAR FUNÇÃO DO USUÁRIO

                const usuarioEditado = await this.prisma.usuarios.update({
                    where: { id },
                    data: {
                        nome:
                            updateUsuarioDto.nome === ''
                                ? usuarioID.nome
                                : updateUsuarioDto.nome,
                        sobrenome:
                            updateUsuarioDto.sobrenome === ''
                                ? usuarioID.sobrenome
                                : updateUsuarioDto.sobrenome,
                        email:
                            updateUsuarioDto.email === ''
                                ? usuarioID.email
                                : updateUsuarioDto.email,
                        senha:
                            updateUsuarioDto.senha.trim() === ''
                                ? usuarioID.senha
                                : updateUsuarioDto.senha,
                        cargoId: !cargo ? usuarioID.cargoId : Number(cargo)
                    }
                });

                return {
                    status: 'A edição foi concluída com sucesso.',
                    dados_antigos: usuarioID,
                    dados_atualizados: usuarioEditado
                };
            }

            throw new HttpException(
                'O ID informado nâo esta vinculado a nenhum usuário cadastrado no sistema.',
                HttpStatus.NOT_FOUND
            );
        } catch (error) {
            throw new HttpException(
                'Erro interno! Não foi possível realizar a consulta dos dados do usuário informado. Por favor, tente novamente.',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async ExcluirUsuario(id: string) {
        try {
            const idUsuario = await this.prisma.usuarios.findFirst({
                where: { id }
            });

            if (idUsuario) {
                const usuario = await this.prisma.usuarios.delete({
                    where: { id }
                });
                return `Os dados do usuário ${usuario.nome.toUpperCase()} ${usuario.sobrenome.toUpperCase()} foram excluídos com sucesso.`;
            }

            throw new HttpException(
                'O ID informado nâo esta vinculado a nenhum usuário cadastrado no sistema.',
                HttpStatus.NOT_FOUND
            );
        } catch (error) {
            throw new HttpException(
                'Erro interno! Não foi possível realizar a consulta dos dados do usuário informado. Por favor, tente novamente.',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
