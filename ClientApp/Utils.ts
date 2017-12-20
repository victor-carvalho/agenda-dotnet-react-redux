import { fetch as originalFetch, addTask } from "domain-task";
import * as Models from "./store/Models";

class StatusError extends Error {
    readonly status: number;

    constructor(status: number, statusText: string) {
        super(statusText);
        this.status = status;
    }
}

export function formatEndereco(endereco: Models.Endereco) {
    return `${endereco.logradouro}, ${endereco.numero} - ${endereco.bairro}, ${
        endereco.cidade
    } - ${endereco.estado}`;
}

export function fetch(
    url: Request | string,
    init?: RequestInit,
    serverSide = false
) {
    const task = originalFetch(url, init).then(response => {
        if (response.ok) {
            return response;
        }
        return Promise.reject(
            new StatusError(response.status, response.statusText)
        );
    });

    if (serverSide) addTask(task);

    return task;
}
