// Invece di interrogare il database useremo questo mock per fare i test del server
// Copiamo il codice da questo link: https://www.prisma.io/docs/guides/testing/unit-testing
// Andiamo sul file jest.config.js per poterlo settare su jest

import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

import prisma from "./client";

jest.mock("./client", () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
    mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
