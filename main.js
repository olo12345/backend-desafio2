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