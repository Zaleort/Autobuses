export interface ApiError {
    error: string;
}

export interface ApiLineas {
    [id: string]: ApiLinea;
}

export interface ApiLinea {
    name: string;
    nucleos: string[];
    paradas: string[];
    horarios?: ApiHorarios;
}

export interface ApiHorarios {
    ida: { [id: string]: ApiHorario[] }
    vuelta: { [id: string]: ApiHorario[] }
}

export interface ApiHorario {
    hora: string;
    frecuencia: string;
}

export interface ApiParadas {
    [id: string]: ApiParada;
}

export interface ApiParada {
    name: string;
    zona?: string;
}

export interface ApiNucleos {
    [id: string]: ApiNucleo;
}

export interface ApiNucleo {
    name: string;
}