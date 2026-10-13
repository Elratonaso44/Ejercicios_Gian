export interface Profesor {
  id: number;
  nombre: string;
  apellido: string;
  edad: number | null;
  materia: string;
}

export interface NuevoProfesor {
  nombre: string;
  apellido: string;
  edad: number | null;
  materia: string;
}

export interface CredencialesLogin {
  username: string;
  password: string;
}

export interface RespuestaLogin {
  mensaje: string;
  token: string;
  tipo: string;
}

export interface RespuestaProfesores {
  mensaje: string;
  data: Profesor[];
}

export interface RespuestaProfesorGuardado {
  mensaje: string;
  data: Profesor;
  creadoPor?: string;
  modificadoPor?: string;
}

export interface RespuestaEliminacion {
  mensaje: string;
  eliminadoPor?: string;
}
