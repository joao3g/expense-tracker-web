export const getMonthOffset = (date: Date, offset: number) => {
    const finalDate = new Date(date);

    finalDate.setDate(1);
    finalDate.setMonth(finalDate.getMonth() + offset);
    return finalDate;
}