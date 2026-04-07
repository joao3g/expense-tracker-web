export const getMonthOffset = (date: Date, offset: number) => {
    const finalDate = new Date(date);

    finalDate.setDate(1);
    finalDate.setMonth(finalDate.getMonth() + offset);
    return finalDate;
}

export const formatMoney = (value: string) => {
    let result: string | number = Number(value.replace(/\D/g, ''));
    result = (result / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return result;
}