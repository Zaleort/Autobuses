interface TablaHorarios {
  frecuencia: string,
  paradas: {
    id: string,
    name: string,
    zona: string,
    horario: Hora[],
  }[]
}

interface Hora {
  hora: string,
  excepcion: string | null,
}

interface LineaFiltro {
  salida: string,
  destino: string,
  frecuencia?: string,
  hora?: string,
}
