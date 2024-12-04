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

      if(id === servicoJaCadastrado.id) {
        id = servicoJaCadastrado.id * 2
      }

      if(!servicoJaCadastrado) {
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

  findAll() {
    return `This action returns all servicos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} servico`;
  }

  update(id: number, updateServicoDto: UpdateServicoDto) {
    return `This action updates a #${id} servico`;
  }

  remove(id: number) {
    return `This action removes a #${id} servico`;
  }
}
