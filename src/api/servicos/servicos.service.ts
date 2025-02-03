import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './../../prisma/prisma.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';

@Injectable()
export class ServicosService {
    constructor(private prisma: PrismaService) {}

    async CriarServicos(createServicoDto: CreateServicoDto) {
        const servicoJaCadastrado = await this.prisma.servicos.findFirst({
            where: { tipo: createServicoDto.tipo }
        });

        var id = Math.floor(Math.random() * 10000) + 1;

        if (!servicoJaCadastrado) {
            const cadastrar = await this.prisma.servicos.create({
                data: {
                    id,
                    tipo: createServicoDto.tipo,
                    preco: createServicoDto.preco
                }
            });

            return `O serviço ${cadastrar.tipo.toUpperCase()} foi cadastrado com sucesso.`;
        }
        throw new HttpException(
            'O serviço informado já esta cadastrado no sistema. Por favor tente novamente.',
            HttpStatus.BAD_REQUEST
        );
    }

    async ListarServicos() {
        const listaDeServicos = await this.prisma.servicos.findMany();

        if (listaDeServicos.length === 0) {
            throw new HttpException(
                'Não existe nenhum serviço cadastrado no sistema.',
                HttpStatus.NOT_FOUND
            );
        }

        return listaDeServicos;
    }

    async ServicoID(id: number) {
        const idServico = await this.prisma.servicos.findFirst({
            where: { id }
        });

        if (!idServico) {
            throw new HttpException(
                `Não existe nenhum serviço com o ID=${id} que foi informado.`,
                HttpStatus.NOT_FOUND
            );
        }

        return idServico;
    }

    async ServicoNome(tipo: string) {
        try {
            const nomeServico = await this.prisma.servicos.findMany({
                where: {
                    tipo: {
                        contains: tipo,
                        mode: 'insensitive'
                    }
                }
            });

            if (!nomeServico) {
                return `Não existe nenhum serviço com o nome ${tipo} cadastrado no sistema.`;
            }

            console.log(tipo);

            return nomeServico;
        } catch (error) {
            return 'Erro interno! Não conseguimos realizar a consulta dos serviços no sistema. Por favor, tente novamente.';
        }
    }

    async EditarServico(id: number, updateServicoDto: UpdateServicoDto) {
        try {
            const servicoId = await this.prisma.servicos.findFirst({
                where: { id }
            });

            if (servicoId) {
                const editado = await this.prisma.servicos.update({
                    where: { id },
                    data: {
                        tipo:
                            updateServicoDto.tipo.trim() === ''
                                ? servicoId.tipo
                                : updateServicoDto.tipo,
                        preco:
                            updateServicoDto.preco === 0
                                ? servicoId.preco
                                : updateServicoDto.preco
                    }
                });

                return {
                    status: 'Os dados foram atualizados com sucesso.',
                    dados_antigos: servicoId,
                    dados_atualizados: editado
                };
            }

            throw new HttpException(
                `Não existe nenhum serviço com o ID=${id} que foi informado.`,
                HttpStatus.NOT_FOUND
            );
        } catch (error) {
            throw new HttpException(
                'Erro interno! Não conseguimos realizar a consulta dos serviços no sistema para realizar as atualizações dos dados. Por favor, tente novamente.',
                HttpStatus.NOT_FOUND
            );
        }
    }

    async ApagarServico(id: number) {
        try {
            const idServidoExistente = await this.prisma.servicos.findFirst({
                where: { id }
            });
            if (idServidoExistente) {
                await this.prisma.servicos.delete({ where: { id } });
                return `Os dados do servico ${idServidoExistente.tipo.toUpperCase()} foram excluídos com sucesso.`;
            }

            throw new HttpException(
                `Não existe nenhum serviço com o ID=${id} que foi informado.`,
                HttpStatus.NOT_FOUND
            );
        } catch (error) {
            throw new HttpException(
                'Erro interno! Não conseguimos realizar a consulta dos serviços no sistema para realizar as atualizações dos dados. Por favor, tente novamente.',
                HttpStatus.NOT_FOUND
            );
        }
    }
}
