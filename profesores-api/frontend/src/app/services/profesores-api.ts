import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CredencialesLogin,
  NuevoProfesor,
  RespuestaEliminacion,
  RespuestaProfesorGuardado,
  RespuestaLogin,
  RespuestaProfesores,
} from '../models/profesor';

@Injectable({ providedIn: 'root' })
export class ProfesoresApi {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000';

  listar(): Observable<RespuestaProfesores> {
    return this.http.get<RespuestaProfesores>(`${this.url}/profesores/listar`);
  }

  iniciarSesion(
    credenciales: CredencialesLogin,
  ): Observable<RespuestaLogin> {
    return this.http.post<RespuestaLogin>(
      `${this.url}/auth/login`,
      credenciales,
    );
  }

  crear(
    profesor: NuevoProfesor,
    token: string,
  ): Observable<RespuestaProfesorGuardado> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<RespuestaProfesorGuardado>(
      `${this.url}/profesores/alta`,
      profesor,
      { headers },
    );
  }

  modificar(
    id: number,
    profesor: NuevoProfesor,
    token: string,
  ): Observable<RespuestaProfesorGuardado> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<RespuestaProfesorGuardado>(
      `${this.url}/profesores/modificar`,
      { id, ...profesor },
      { headers },
    );
  }

  eliminar(id: number, token: string): Observable<RespuestaEliminacion> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<RespuestaEliminacion>(
      `${this.url}/profesores/eliminar/${id}`,
      { headers },
    );
  }
}
