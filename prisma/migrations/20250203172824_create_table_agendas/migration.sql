-- CreateTable
CREATE TABLE "agendas" (
    "id" TEXT NOT NULL,
    "client" TEXT,
    "profissional" TEXT,
    "servicos" TEXT[],
    "agendamento" TIMESTAMP(3) NOT NULL,
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_atualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agendas_pkey" PRIMARY KEY ("id")
);
