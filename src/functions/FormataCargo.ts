export function FormataCargo(tipoCargo: string) {

    let cargo = 0;

    switch (tipoCargo) {
        case "Desenvolvedor":
        case "desenvolvedor":
            cargo = 3
            break;
        case "Cliente":
        case "cliente":
            cargo = 4
            break;
        case "Profissional":
        case "profissional":
            cargo = 5
            break;
        default:
            return "Cargo inválido ou não encontrado."
    }

    return cargo
}