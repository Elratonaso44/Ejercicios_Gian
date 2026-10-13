class Estudiante {
  constructor(id, nombre, apellido, curso, carrera, edad) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.curso = curso;
    this.carrera = carrera;
    this.edad = edad;
  }

  get nombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }

  validar() {
    if (!this.nombre || !this.apellido) {
      throw new Error("Nombre y apellido son obligatorios");
    }
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      curso: this.curso,
      carrera: this.carrera,
      edad: this.edad,
    };
  }


}

export default Estudiante;
