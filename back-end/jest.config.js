const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // ✅ Resolve o alias "@/"
  },
  roots: ["<rootDir>/src"], // ✅ Garante que os testes em qualquer subpasta de src sejam detectados
  verbose: true,
};
