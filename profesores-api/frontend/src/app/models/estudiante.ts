export interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  curso: string | null;
  carrera: string | null;
  edad: number | null;
}

export interface NuevoEstudiante {
  nombre: string;
  apellido: string;
  curso: string | null;
  carrera: string | null;
  edad: number | null;
}

export interface RespuestaEstudiantes {
  mensaje: string;
  data: Estudiante[];
}

export interface RespuestaEstudiante {
  mensaje: string;
  data: Estudiante;
  creadoPor?: string;
  modificadoPor?: string;
}

export interface RespuestaEliminacionEstudiante {
  mensaje: string;
  eliminadoPor?: string;
}
