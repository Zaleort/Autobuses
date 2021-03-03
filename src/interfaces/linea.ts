export interface TablaHorarios {
  frecuencia: string,
  paradas: {
    id: string,
    name: string,
    zona: string,
    horario: Hora[],
  }[]
}

export interface Hora {
  hora: string,
  excepcion: string | null,
}
