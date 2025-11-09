-- CreateTable
CREATE TABLE "comunicado" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idMembro" TEXT,

    CONSTRAINT "comunicado_pkey" PRIMARY KEY ("id")
);
