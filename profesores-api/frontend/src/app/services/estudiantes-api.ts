import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Estudiante,
  NuevoEstudiante,
  RespuestaEliminacionEstudiante,
  RespuestaEstudiante,
  RespuestaEstudiantes,
} from '../models/estudiante';

@Injectable({ providedIn: 'root' })
export class EstudiantesApi {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000';

  listar(): Observable<RespuestaEstudiantes> {
    return this.http.get<RespuestaEstudiantes>(`${this.url}/estudiantes/listar`);
  }

  crear(estudiante: NuevoEstudiante, token: string): Observable<RespuestaEstudiante> {
    return this.http.post<RespuestaEstudiante>(
      `${this.url}/estudiantes/alta`,
      estudiante,
      { headers: this.headers(token) },
    );
  }

  modificar(
    id: number,
    estudiante: NuevoEstudiante,
    token: string,
  ): Observable<RespuestaEstudiante> {
    return this.http.put<RespuestaEstudiante>(
      `${this.url}/estudiantes/modificar`,
      { id, ...estudiante },
      { headers: this.headers(token) },
    );
  }

  eliminar(id: number, token: string): Observable<RespuestaEliminacionEstudiante> {
    return this.http.delete<RespuestaEliminacionEstudiante>(
      `${this.url}/estudiantes/eliminar/${id}`,
      { headers: this.headers(token) },
    );
  }

  private headers(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
