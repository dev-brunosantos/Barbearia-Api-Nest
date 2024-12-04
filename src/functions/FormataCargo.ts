export function FormataCargo(tipoCargo: string) {

    let cargo = 0;

    switch (tipoCargo) {
        case "Desenvolvedor":
            cargo = 3
            break;
        case "Cliente":
            cargo = 4
            break;
        case "Profissional":
            cargo = 5
            break;
        default:
            return "Cargo inválido ou não encontrado."
    }

    return cargo
}