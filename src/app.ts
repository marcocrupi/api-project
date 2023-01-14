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

// Con npm test -- --watch Jest rimarrà in attesa di eventuali cambiamenti nei file di test o
// nei file dell'applicazione e li rieseguirà automaticamente ogni volta che
// un cambiamento viene rilevato. Ciò è utile durante lo sviluppo, poiché consente
// di eseguire automaticamente i test ogni volta che si apportano modifiche al codice,
// in modo da poter verificare rapidamente se le modifiche causano eventuali errori.

import {
    validate,
    validationErrorMiddleware,
    planetSchema,
    PlanetData,
} from "./lib/validation";

const app = express();

// In sintesi app.use(express.json()) consente di gestire i dati in formato JSON
// nella richiesta HTTP, e convertirli in un oggetto javascript accessibile tramite
// req.body, in modo da poter utilizzare i dati nella richiesta nella logica delle richiesta.
app.use(express.json());

// Facciamo una richiesta al DB tramite prisma client
app.get("/planets", async (request, response) => {
    // Ci permette di trovare più record
    const planets = await prisma.planet.findMany();

    // Mandiamo l'array di pianeti in una risposta json
    response.json(planets);
});

// Il carattere "\d" rappresenta un carattere di cifra,
// mentre il simbolo "+" indica che ci devono essere almeno
// uno o più caratteri di cifra dopo il carattere "\d".
// In questo caso, "\d+" indica che la route accetterà solo una stringa
// di uno o più caratteri numerici dopo l'URL "/planets/".
app.get("/planets/:id(\\d+)", async (request, response, next) => {
    const planetId = Number(request.params.id);
    const planet = await prisma.planet.findUnique({
        where: { id: planetId },
    });

    if (!planet) {
        response.status(404);
        return next(`Cannot GET /planets/${planetId}`);
    }

    response.json(planet);
});

// Installiamo il pacchetto TypeBox @sinclair/typebox

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

app.put(
    "/planets/:id(\\d+)",
    validate({ body: planetSchema }),
    async (request, response, next) => {
        const planetId = Number(request.params.id);
        const planetData: PlanetData = request.body;

        try {
            const planet = await prisma.planet.update({
                where: { id: planetId },
                data: planetData,
            });

            response.status(200).json(planet);
        } catch (error) {
            response.status(404);
            next(`Cannot PUT /planets/${planetId}`);
        }
    }
);

app.delete("/planets/:id(\\d+)", async (request, response, next) => {
    const planetId = Number(request.params.id);

    try {
        await prisma.planet.delete({
            where: { id: planetId },
        });

        response.status(204).end();
    } catch (error) {
        response.status(404);
        next(`Cannot DELETE /planets/${planetId}`);
    }
});

// Installiamo il pacchetto express-json-validator-middleware
// è un middleware per Express che consente di verificare che i dati inviati
//  tramite richieste HTTP siano conformi a uno schema di validazione specifico,
// aiutando ad evitare problemi di sicurezza e di integrità dei dati
// all'interno dell'applicazione.
// Installiamo anche le ajv-formats
// Digitiamo sul terminale: npm i express-json-validator-middleware ajv-formats
app.use(validationErrorMiddleware);

export default app;
