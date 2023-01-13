import express from "express";
import "express-async-errors";

// Con prisma possiamo interrogare il database, ovvero richiedere informazioni
// da un database utilizzando una query SQL (Structured Query Language).
// In altre parole, si tratta di una richiesta per cercare e recuperare dati
// specifici da un database.
import prisma from "./lib/prisma/client";

// Avviamo il nostro server con npm run dev
// Digitando sul terminale "npx prisma studio" "npx prisma studio" è un comando che
// viene eseguito tramite la riga di comando (terminale o prompt dei comandi) e serve
// per avviare l'interfaccia grafica di Prisma Studio.
// Prisma Studio è uno strumento per la gestione dei database che consente di creare
// e modificare il modello dati, eseguire query e gestire i dati del proprio database.
// Inserendo questo comando si apre una interfaccia grafica sulla quale è possibile
// interagire con il proprio database.

// Installiamo il pacchetto jest-mock-extended. In sintesi jest-mock-extended è una
// libreria per il mocking avanzato per Jest che permette di creare mock più flessibili
// e precisi, e di registrare e verificare il comportamento delle dipendenze durante i test.
// npm install --save-dev jest-mock-extended

import {
    validate,
    validationErrorMiddleware,
    planetSchema,
    PlanetData,
} from "./lib/validation";

const app = express();

app.use(express.json());

// Facciamo una richiesta al DB tramite prisma client
app.get("/planets", async (request, response) => {
    // Ci permette di trovare più record
    const planets = await prisma.planet.findMany();

    // Mandiamo l'array di pianeti in una risposta json
    response.json(planets);
});

app.post(
    "/planets",
    validate({ body: planetSchema }),
    async (request, response) => {
        const planetData: PlanetData = request.body;

        const planet = await prisma.planet.create({
            data: planetData,
        });

        response.status(201).json(planet);
    }
);

app.use(validationErrorMiddleware);

export default app;
