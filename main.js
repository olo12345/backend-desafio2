import fs from "fs";
import express from "express";

const app = express();
const PORT = 3000;
const __dirname = import.meta.dirname;

// Middleware para permitir la lectura del payload (body) en formato JSON
// Necesario para manipular datos enviados en consultas POST y PUT
// Comentario hecho por Carlos Carrillo Ortega (Punto 5)
app.use(express.json());

app.listen(PORT,
    () => {
        fs.readFileSync("./data/canciones.json", "utf8");
        return console.log(`Servidor iniciado en http://localhost:${PORT}`);
    }
);

app.get("/",
    (req, res) => res.sendFile(__dirname + "/index.html")
);

app.get("/canciones", (req, res) => {
    try {
        res.status(200).json(
            JSON.parse(fs.readFileSync("./data/canciones.json", "utf8"))
        );
    } catch (error) {
        return error;
    }
});

// Inicio actividad por Carlos Carrillo Bastidas

// ------------------------------------------------------
// Punto 5: Manipulación del payload de una consulta HTTP
// En esta ruta POST se utiliza req.body para recibir
// y almacenar los datos enviados desde el cliente
// Comentario hecho por Carlos Carrillo Ortega
// ------------------------------------------------------
app.post("/canciones", (req, res) => {
    const canciones = JSON.parse(
        fs.readFileSync("./data/canciones.json", "utf8")
    );

    // req.body representa el payload de la consulta HTTP
    // El payload contiene los datos de la nueva canción
    // Comentario hecho por Carlos Carrillo Ortega (Punto 5)
    canciones.push(req.body);

    fs.writeFileSync(
        "./data/canciones.json",
        JSON.stringify(canciones, null, 2)
    );

    res.send("agregado muchachon");
});

// ------------------------------------------------------
// Punto 4: Manipulación de parámetros obtenidos en la URL
// Se utiliza el parámetro dinámico :id para identificar
// la canción a modificar
// Comentario hecho por Carlos Carrillo Ortega
//
// Punto 5: Manipulación del payload HTTP
// Se utiliza req.body para actualizar los datos de la canción
// Comentario hecho por Carlos Carrillo Ortega
// ------------------------------------------------------
app.put("/canciones/:id", (req, res) => {
    const canciones = JSON.parse(
        fs.readFileSync("./data/canciones.json", "utf8")
    );

    // Obtención y manipulación del parámetro id desde la URL
    // req.params.id es recibido como string y convertido a número
    // Comentario hecho por Carlos Carrillo Ortega (Punto 4)
    const id = parseInt(req.params.id);

    const index = canciones.findIndex((cancion) => cancion.id === id);

    if (index !== -1) {
        // Manipulación del payload HTTP (req.body)
        // Se combinan los datos existentes con los nuevos datos enviados
        // Comentario hecho por Carlos Carrillo Ortega (Punto 5)
        canciones[index] = { ...canciones[index], ...req.body };

        fs.writeFileSync(
            "./data/canciones.json",
            JSON.stringify(canciones, null, 2)
        );

        res.send("cancion actualizada");
    } else {
        res.status(404).send("cancion no encontrada");
    }
});

// ------------------------------------------------------
// Punto 4: Manipulación de parámetros obtenidos en la URL
// Se utiliza el parámetro :id para identificar qué canción
// debe ser eliminada del archivo JSON
// Comentario hecho por Carlos Carrillo Ortega
// ------------------------------------------------------
app.delete("/canciones/:id", (req, res) => {
    const canciones = JSON.parse(
        fs.readFileSync("./data/canciones.json", "utf8")
    );

    // Obtención y conversión del parámetro id desde la URL
    // Comentario hecho por Carlos Carrillo Ortega (Punto 4)
    const id = parseInt(req.params.id);

    const index = canciones.findIndex((cancion) => cancion.id === id);

    if (index !== -1) {
        canciones.splice(index, 1);

        fs.writeFileSync(
            "./data/canciones.json",
            JSON.stringify(canciones, null, 2)
        );

        res.send("cancion eliminada");
    } else {
        res.status(404).send("cancion no encontrada");
    }
});

// Fin actividad por Carlos Carrillo Bastidas
