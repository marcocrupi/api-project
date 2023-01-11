module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    clearMocks: true,
    setupFileAfterEnv: [".src/lib/prisma/client.mock.ts"],
};
