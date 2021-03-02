export interface TablaHorarios {
  frecuencia: string,
  paradas: {
    name: string,
    zona: string,
    horario: Hora[],
  }[]
}

export interface Hora {
  hora: string,
  excepcion: string | null,
}
