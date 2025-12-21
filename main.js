import fs from "fs";
import express from "express";

/*
------------------------------------------------------
PUNTO 1:
Se crea una aplicación Express que permitirá
levantar un servidor web local y gestionar
rutas HTTP.
------------------------------------------------------
*/
const app = express();
const PORT = 3000;

/*
__dirname se utiliza para obtener la ruta absoluta
del directorio actual, necesaria para servir archivos
estáticos como HTML.
*/
const __dirname = import.meta.dirname;

/*
------------------------------------------------------
PUNTO 5:
Middleware que permite al servidor interpretar
el payload (body) de las consultas HTTP en formato JSON.
Esto es fundamental para recibir datos en POST y PUT.
------------------------------------------------------
*/
app.use(express.json());

/*
------------------------------------------------------
PUNTO 1:
El servidor Express se levanta en el puerto 3000,
dejándolo disponible para recibir solicitudes HTTP.
------------------------------------------------------
*/
app.listen(PORT, () => {
    fs.readFileSync("./data/canciones.json", "utf8");
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

/*
------------------------------------------------------
punto 2:
Ruta GET raíz que devuelve una página web (index.html)
como respuesta a una consulta HTTP.
------------------------------------------------------
*/
app.get("/", (req, res) =>
    res.sendFile(__dirname + "/index.html")
);

/*
------------------------------------------------------
PUNTO 3 – CRUD:
Ruta GET que permite leer (READ) los datos almacenados
en un archivo JSON local y devolverlos como respuesta.
------------------------------------------------------
*/
app.get("/canciones", (req, res) => {
    try {
        res.status(200).json(
            JSON.parse(fs.readFileSync("./data/canciones.json", "utf8"))
        );
    } catch (error) {
        return error;
    }
});

/*
------------------------------------------------------
PUNTO 3 – CRUD:
Ruta POST que permite crear (CREATE) un nuevo registro
en el archivo JSON local.

PUNTO 5:
Se manipula el payload HTTP mediante req.body,
recibiendo los datos enviados por el cliente.
------------------------------------------------------
*/
app.post("/canciones", (req, res) => {
    const canciones = JSON.parse(
        fs.readFileSync("./data/canciones.json", "utf8")
    );

    /*
    req.body contiene el payload de la solicitud HTTP,
    el cual representa la nueva canción enviada
    desde el cliente.
    */
    canciones.push(req.body);

    fs.writeFileSync(
        "./data/canciones.json",
        JSON.stringify(canciones, null, 2)
    );

    res.send("agregado muchachon");
});

/*
------------------------------------------------------
PUNTO 3 – CRUD:
Ruta PUT que permite actualizar (UPDATE) un registro
existente en el archivo JSON.

PUNTO 4:
Se manipulan parámetros obtenidos desde la URL (:id).

PUNTO 5:
Se manipula el payload HTTP para actualizar los datos.
------------------------------------------------------
*/
app.put("/canciones/:id", (req, res) => {
    const canciones = JSON.parse(
        fs.readFileSync("./data/canciones.json", "utf8")
    );

    /*
    El parámetro :id se obtiene desde la URL usando
    req.params.id y se convierte a número para su uso.
    */
    const id = parseInt(req.params.id);

    const index = canciones.findIndex(
        (cancion) => cancion.id === id
    );

    if (index !== -1) {
        /*
        Se combinan los datos existentes con los nuevos
        datos enviados en el payload (req.body).
        */
        canciones[index] = {
            ...canciones[index],
            ...req.body
        };

        fs.writeFileSync(
            "./data/canciones.json",
            JSON.stringify(canciones, null, 2)
        );

        res.send("cancion actualizada");
    } else {
        res.status(404).send("cancion no encontrada");
    }
});

/*
------------------------------------------------------
PUNTO 3 – CRUD:
Ruta DELETE que permite eliminar (DELETE) un registro
del archivo JSON local.

PUNTO 4:
Se utiliza el parámetro dinámico :id para identificar
el elemento a eliminar.
------------------------------------------------------
*/
app.delete("/canciones/:id", (req, res) => {
    const canciones = JSON.parse(
        fs.readFileSync("./data/canciones.json", "utf8")
    );

    /*
    Se obtiene el parámetro id desde la URL y se convierte
    a número para su comparación.
    */
    const id = parseInt(req.params.id);

    const index = canciones.findIndex(
        (cancion) => cancion.id === id
    );

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