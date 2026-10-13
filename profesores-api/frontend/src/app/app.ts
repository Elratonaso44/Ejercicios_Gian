import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Estudiante, NuevoEstudiante } from './models/estudiante';
import { NuevoProfesor, Profesor } from './models/profesor';
import { EstudiantesApi } from './services/estudiantes-api';
import { ProfesoresApi } from './services/profesores-api';

type Seccion = 'profesores' | 'estudiantes';

@Component({
  imports: [FormsModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly profesoresApi = inject(ProfesoresApi);
  private readonly estudiantesApi = inject(EstudiantesApi);

  readonly seccion = signal<Seccion>('profesores');
  readonly profesores = signal<Profesor[]>([]);
  readonly estudiantes = signal<Estudiante[]>([]);
  readonly profesoresCargando = signal(true);
  readonly estudiantesCargando = signal(true);
  readonly guardando = signal(false);
  readonly error = signal('');
  readonly mensaje = signal('');
  readonly token = signal('');
  readonly profesorEditandoId = signal<number | null>(null);
  readonly estudianteEditandoId = signal<number | null>(null);

  username = '';
  password = '';

  nuevoProfesor: NuevoProfesor = {
    nombre: '',
    apellido: '',
    edad: null,
    materia: '',
  };

  nuevoEstudiante: NuevoEstudiante = {
    nombre: '',
    apellido: '',
    curso: '',
    carrera: '',
    edad: null,
  };

  ngOnInit(): void {
    this.cargarProfesores();
    this.cargarEstudiantes();
  }

  seleccionarSeccion(seccion: Seccion): void {
    this.seccion.set(seccion);
    this.error.set('');
    this.mensaje.set('');
  }

  iniciarSesion(): void {
    this.error.set('');
    this.mensaje.set('');

    this.profesoresApi.iniciarSesion({
      username: this.username,
      password: this.password,
    }).subscribe({
      next: (respuesta) => {
        this.token.set(respuesta.token);
        this.password = '';
        this.mensaje.set('Sesión iniciada. Ya podés gestionar los registros.');
      },
      error: () => {
        this.error.set('No se pudo iniciar sesión. Revisá el usuario y la contraseña.');
      },
    });
  }

  cerrarSesion(): void {
    this.token.set('');
    this.cancelarEdicionProfesor();
    this.cancelarEdicionEstudiante();
    this.mensaje.set('');
    this.error.set('');
  }

  cargarProfesores(): void {
    this.profesoresCargando.set(true);
    this.profesoresApi.listar().subscribe({
      next: (respuesta) => {
        this.profesores.set(respuesta.data);
        this.profesoresCargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los profesores. Revisá la API.');
        this.profesoresCargando.set(false);
      },
    });
  }

  cargarEstudiantes(): void {
    this.estudiantesCargando.set(true);
    this.estudiantesApi.listar().subscribe({
      next: (respuesta) => {
        this.estudiantes.set(respuesta.data);
        this.estudiantesCargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los estudiantes. Revisá la API.');
        this.estudiantesCargando.set(false);
      },
    });
  }

  guardarProfesor(): void {
    this.error.set('');
    this.mensaje.set('');
    this.guardando.set(true);

    const id = this.profesorEditandoId();
    const peticion = id === null
      ? this.profesoresApi.crear(this.nuevoProfesor, this.token())
      : this.profesoresApi.modificar(id, this.nuevoProfesor, this.token());

    peticion.subscribe({
      next: (respuesta) => {
        this.profesores.update((lista) => id === null
          ? [...lista, respuesta.data]
          : lista.map((profesor) => profesor.id === id ? respuesta.data : profesor));
        this.cancelarEdicionProfesor();
        this.mensaje.set(respuesta.mensaje);
        this.guardando.set(false);
      },
      error: () => {
        this.error.set('No se pudo guardar el profesor. Revisá la sesión y los datos.');
        this.guardando.set(false);
      },
    });
  }

  editarProfesor(profesor: Profesor): void {
    this.profesorEditandoId.set(profesor.id);
    this.nuevoProfesor = {
      nombre: profesor.nombre,
      apellido: profesor.apellido,
      edad: profesor.edad,
      materia: profesor.materia,
    };
  }

  cancelarEdicionProfesor(): void {
    this.profesorEditandoId.set(null);
    this.nuevoProfesor = { nombre: '', apellido: '', edad: null, materia: '' };
  }

  eliminarProfesor(profesor: Profesor): void {
    if (!window.confirm(`¿Eliminar a ${profesor.nombre} ${profesor.apellido}?`)) return;

    this.error.set('');
    this.mensaje.set('');
    this.profesoresApi.eliminar(profesor.id, this.token()).subscribe({
      next: (respuesta) => {
        this.profesores.update((lista) => lista.filter((item) => item.id !== profesor.id));
        this.mensaje.set(respuesta.mensaje);
      },
      error: () => this.error.set('No se pudo eliminar el profesor. Revisá la sesión.'),
    });
  }

  guardarEstudiante(): void {
    this.error.set('');
    this.mensaje.set('');
    this.guardando.set(true);

    const id = this.estudianteEditandoId();
    const peticion = id === null
      ? this.estudiantesApi.crear(this.nuevoEstudiante, this.token())
      : this.estudiantesApi.modificar(id, this.nuevoEstudiante, this.token());

    peticion.subscribe({
      next: (respuesta) => {
        this.estudiantes.update((lista) => id === null
          ? [...lista, respuesta.data]
          : lista.map((estudiante) => estudiante.id === id ? respuesta.data : estudiante));
        this.cancelarEdicionEstudiante();
        this.mensaje.set(respuesta.mensaje);
        this.guardando.set(false);
      },
      error: () => {
        this.error.set('No se pudo guardar el estudiante. Revisá la sesión y los datos.');
        this.guardando.set(false);
      },
    });
  }

  editarEstudiante(estudiante: Estudiante): void {
    this.estudianteEditandoId.set(estudiante.id);
    this.nuevoEstudiante = {
      nombre: estudiante.nombre,
      apellido: estudiante.apellido,
      curso: estudiante.curso,
      carrera: estudiante.carrera,
      edad: estudiante.edad,
    };
  }

  cancelarEdicionEstudiante(): void {
    this.estudianteEditandoId.set(null);
    this.nuevoEstudiante = {
      nombre: '',
      apellido: '',
      curso: '',
      carrera: '',
      edad: null,
    };
  }

  eliminarEstudiante(estudiante: Estudiante): void {
    if (!window.confirm(`¿Eliminar a ${estudiante.nombre} ${estudiante.apellido}?`)) return;

    this.error.set('');
    this.mensaje.set('');
    this.estudiantesApi.eliminar(estudiante.id, this.token()).subscribe({
      next: (respuesta) => {
        this.estudiantes.update((lista) => lista.filter((item) => item.id !== estudiante.id));
        this.mensaje.set(respuesta.mensaje);
      },
      error: () => this.error.set('No se pudo eliminar el estudiante. Revisá la sesión.'),
    });
  }
}
