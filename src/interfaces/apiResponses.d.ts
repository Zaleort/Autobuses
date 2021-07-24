interface ApiLineas {
  [id: string]: ApiLinea;
}

interface ApiLinea {
  _id: string;
  name: string;
  nucleosIda: string[];
  nucleosVuelta?: string[];
  paradasIda: string[];
  paradasVuelta?: string[];
  horarios: ApiHorarios;
  paradasInfo: ApiParada[];
  nucleosInfo: ApiNucleo[];
  accesible: boolean;
  saltos: number;
}

interface ApiHorarios {
  ida: { [id: string]: ApiHorario[] };
  vuelta: { [id: string]: ApiHorario[] };
}

interface ApiHorario {
  hora: string;
  frecuencia: string;
}

interface ApiParadas {
  [id: string]: ApiParada;
}

interface ApiParada {
  _id: string;
  name: string;
  zona: string;
}

interface ApiNucleos {
  [id: string]: ApiNucleo;
}

interface ApiNucleo {
  _id: string;
  name: string;
}
