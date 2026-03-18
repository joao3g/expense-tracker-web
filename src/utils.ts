export const getMonthOffset = (date: Date, offset: number) => {
    const finalDate = new Date(date);

    finalDate.setMonth(finalDate.getMonth() + offset);
    return finalDate;
}