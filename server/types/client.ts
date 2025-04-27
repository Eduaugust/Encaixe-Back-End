export interface ClientData {
    id?: number;
    name?: string;
    number: string;
    service?: string;
    morning: boolean;
    afternoon: boolean;
    start: string;
    end: string;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    userId: number;
}

export interface ClientCreateData extends Omit<ClientData, 'id'> {
    // Dados necessários para criação de um cliente (sem o ID que é gerado automaticamente)
}

export interface ClientUpdateData extends Partial<ClientData> {
    // Todos os campos são opcionais para atualizações parciais
}
