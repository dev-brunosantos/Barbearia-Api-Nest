-- CreateTable
CREATE TABLE "cargos" (
    "id" SERIAL NOT NULL,
    "cargo" TEXT NOT NULL,
    "dt_criacao" TIMESTAMP(3) NOT NULL,
    "dt_atualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cargos_pkey" PRIMARY KEY ("id")
);
