-- CreateTable
CREATE TABLE "Teste" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,

    CONSTRAINT "Teste_pkey" PRIMARY KEY ("id")
);
