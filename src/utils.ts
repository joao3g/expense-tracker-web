export const getMonthOffset = (date: Date, offset: number) => {
    const finalDate = new Date(date);

    offset > 0 ? finalDate.setMonth(finalDate.getMonth() + offset) : finalDate.setMonth(finalDate.getMonth() - offset);
    return finalDate;
}