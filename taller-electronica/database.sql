CREATE DATABASE IF NOT EXISTS taller_electronica CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE taller_electronica;
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(30) NOT NULL
);
CREATE TABLE IF NOT EXISTS dispositivos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  marca VARCHAR(100) NOT NULL,
  cliente_id INT NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
CREATE TABLE IF NOT EXISTS tipos_falla (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS reparaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dispositivo_id INT NOT NULL,
  tipo_falla_id INT NOT NULL,
  usuario_id INT NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  estado VARCHAR(30) NOT NULL DEFAULT 'Pendiente',
  FOREIGN KEY (dispositivo_id) REFERENCES dispositivos(id),
  FOREIGN KEY (tipo_falla_id) REFERENCES tipos_falla(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
INSERT IGNORE INTO tipos_falla (nombre) VALUES ('No enciende'), ('Problema de sonido'), ('Problema de imagen'), ('Otra falla');
