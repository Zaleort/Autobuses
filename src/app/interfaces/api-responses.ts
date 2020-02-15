export interface ApiError {
    error: string;
}

export interface ApiLineas {
    [id: string]: ApiLinea;
}

export interface ApiLinea {
    _id: string;
    name: string;
    nucleosIda: string[];
    nucleosVuelta?: string[];
    paradasIda: string[];
    paradasVuelta?: string[];
    horarios?: ApiHorarios;
    paradasInfo?: ApiParada[];
    nucleosInfo?: ApiNucleo[];
    accesible: boolean;
    saltos: number;
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
    _id: string;
    name: string;
    zona?: string;
}

export interface ApiNucleos {
    [id: string]: ApiNucleo;
}

export interface ApiNucleo {
    _id: string;
    name: string;
}