import express, { Router } from "express";

import prisma from "../lib/prisma/client";

import {
    validate,
    planetSchema,
    PlanetData,
} from "../lib/middleware/validation";

import { initMulterMiddleware } from "../lib/middleware/multer";

const upload = initMulterMiddleware();

const router = Router();

router.get("/", async (request, response) => {
    // Ci permette di trovare più record
    const planets = await prisma.planet.findMany();

    // Mandiamo l'array di pianeti in una risposta json
    response.json(planets);
});

router.get("/:id(\\d+)", async (request, response, next) => {
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

router.post(
    "/",
    validate({ body: planetSchema }),
    async (request, response) => {
        const planetData: PlanetData = request.body;

        const planet = await prisma.planet.create({
            data: planetData,
        });

        response.status(201).json(planet);
    }
);

router.put(
    "/:id(\\d+)",
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

router.delete("/:id(\\d+)", async (request, response, next) => {
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

router.post(
    "/:id(\\d+)/photo",
    upload.single("photo"),
    async (request, response, next) => {
        // Installiamo multer
        console.log("request file", request.file);

        if (!request.file) {
            response.status(400);
            return next("No photo file uploaded");
        }

        const planetId = Number(request.params.id);

        const photoFilename = request.file.filename;

        try {
            await prisma.planet.update({
                where: { id: planetId },
                data: { photoFilename },
            });
        } catch (error) {
            response.status(404);
            next(`Cannot POST /planets/${planetId}/photo`);
        }
        response.status(201).json({ photoFilename });
    }
);

router.use("/photos", express.static("uploads"));

export default router;
