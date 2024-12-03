export class Usuario {
    id: string;
    nome: string;
    sobrenome?: string;
    email: string;
    senha: string;
    cargo: number;
    dt_criacao: Date;
    dt_atualizacao: Date;
}
