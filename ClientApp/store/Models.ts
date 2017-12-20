export interface Contato {
    id?: number;
    tipo: string;
    valor: string;
}

export interface Endereco {
    id?: number;
    tipo: string;
    logradouro: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
}

export interface Pessoa {
    id?: number;
    nome: string;
    contatos: Contato[];
    enderecos: Endereco[];
    marcadores: string[];
}
