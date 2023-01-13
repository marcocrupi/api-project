import supertest from "supertest";
import app from "./app";

import { prismaMock } from "./lib/prisma/client.mock";

const request = supertest(app);
describe("GET /planets", () => {
    test("Valid request", async () => {
        const planets = [
            {
                id: 1,
                name: "Mercury",
                description: null,
                diameter: 1234,
                moons: 12,
                CreatedAt: "2023-01-10T08:20:41.068Z",
                updatedAt: "2023-01-10T08:20:55.985Z",
            },
            {
                id: 2,
                name: "Venus",
                description: null,
                diameter: 5678,
                moons: 2,
                CreatedAt: "2023-01-10T08:22:23.814Z",
                updatedAt: "2023-01-10T08:21:51.139Z",
            },
        ];

        //@ts-ignore
        prismaMock.planet.findMany.mockResolvedValue(planets);
        // Il commento @ts-ignore serve per ignorare un errore di tipo del compilatore TypeScript
        // Questo codice ci permette di creare un mock della funzione findMany
        // dell'oggetto prismaMock.planet per poter testare una funzione o un modulo che
        // utilizza questa funzione senza dover utilizzare un database vero durante i test.
        // Inoltre specifica un valore predefinito come risposta quando questa funzione viene chiamata.

        const response = await request
            .get("/planets")
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual(planets);
    });
});

describe("POST /planets", () => {
    test("Valid request", async () => {
        const planet = {
            id: 1,
            name: "Mercury",
            description: null,
            diameter: 1234,
            moons: 12,
            CreatedAt: "2023-01-10T08:20:41.068Z",
            updatedAt: "2023-01-10T08:20:55.985Z",
        };

        //@ts-ignore
        prismaMock.planet.create.mockResolvedValue(planet);

        const response = await request
            .post("/planets")
            .send({
                name: "Mercury",
                diameter: 1234,
                moons: 12,
            })
            .expect(201)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual(planet);
    });

    test("Invalid request", async () => {
        const planet = {
            diameter: 1234,
            moons: 12,
        };

        const response = await request
            .post("/planets")
            .send(planet)
            .expect(422)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual({
            errors: {
                body: expect.any(Array),
            },
        });
    });
});
