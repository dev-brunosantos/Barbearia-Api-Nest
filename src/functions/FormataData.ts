export function formatarDataISO(data: Date) {
    const [ano, mes, dia] = data.toISOString().slice(0, 10).split('-');
    return `${dia}/${mes}/${ano}`;
}
