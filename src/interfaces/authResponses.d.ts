interface AuthUsuario {
  _id?: string,
  usuario: string,
  contrasena: string,
  autobuses?: {
    recorridos?: string[],
    lineas?: string[],
  },
  token: string,
}