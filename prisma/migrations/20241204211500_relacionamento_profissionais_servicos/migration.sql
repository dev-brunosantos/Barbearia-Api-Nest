-- CreateTable
CREATE TABLE "servicos" (
    "id" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "prof_id" TEXT NOT NULL,

    CONSTRAINT "servicos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "servicos_tipo_key" ON "servicos"("tipo");

-- AddForeignKey
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_prof_id_fkey" FOREIGN KEY ("prof_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
