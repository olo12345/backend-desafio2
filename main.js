import fs from "fs";
import express from "express";

const app = express();
const PORT = 3000;
const __dirname = import.meta.dirname;

app.use(express.json());

app.listen(PORT,
    () => {
        fs.readFileSync("./data/canciones.json", "utf8");
        return console.log(`Servidor iniciado en http://localhost:${PORT}`);
    }
    )

    app.get("/",
        (req, res) => res.sendFile(__dirname + "/index.html")
    )

    app.get("/canciones", (req, res) => {
        try {

            res.status(200).json(JSON.parse(fs.readFileSync("./data/canciones.json", "utf8")))
        }
        catch (error) {
                return error;
        }
    });


    // app.post("/canciones", (req, res) => {
    //     try {
    //         const yo = 1;
    //     }
    //     catch (error) {
    //         return error;
    //     }
    // });


// app.put("/canciones/:id");


// app.delete("/canciones")

// Inicio actividad por Carlos Carrillo Bastidas

app.post("/canciones", (req, res) => {
    const canciones = JSON.parse(
        fs.readFileSync("./data/canciones.json", "utf8")
    );
    canciones.push(req.body);
    
    fs.writeFileSync("./data/canciones.json", JSON.stringify(canciones, null, 2));
    res.send("agregado muchachon");
});

app.put("/canciones/:id", (req, res) => {
    const canciones = JSON.parse(
        fs.readFileSync("./data/canciones.json", "utf8")
    );
    const id = parseInt(req.params.id);
    const index = canciones.findIndex((cancion) => cancion.id === id);
    if (index !== -1) {
        canciones[index] = { ...canciones[index], ...req.body };
        fs.writeFileSync("./data/canciones.json", JSON.stringify(canciones, null, 2));
        res.send("cancion actualizada");
    } else {
        res.status(404).send("cancion no encontrada");
    }   
});

app.delete("/canciones/:id", (req, res) => {
    const canciones = JSON.parse(
        fs.readFileSync("./data/canciones.json", "utf8")
    );
    const id = parseInt(req.params.id);
    const index = canciones.findIndex((cancion) => cancion.id === id);
    if (index !== -1) {
        canciones.splice(index, 1);
        fs.writeFileSync("./data/canciones.json", JSON.stringify(canciones, null, 2));
        res.send("cancion eliminada");
    } else {
        res.status(404).send("cancion no encontrada");
    }   
}
);

// Fin actividad por Carlos Carrillo Bastidas