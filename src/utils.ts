export const getMonthOffset = (date: Date, offset: number) => {
    const finalDate = new Date(date);

    finalDate.setDate(1);
    finalDate.setMonth(finalDate.getMonth() + offset);
    return finalDate;
}

export const getDateInCurrentOffset = (date: Date) => {
    return new Date(date.toISOString().split("T")[0] + "T00:00");
}

export const formatMoney = (value: string) => {
    let result: string | number = Number(value.replace(/\D/g, ''));
    result = (result / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return result;
}

export const hexToHsl = (hex: string) => {
    hex = hex.replace("#", "")

    const r = parseInt(hex.substring(0, 2), 16) / 255
    const g = parseInt(hex.substring(2, 4), 16) / 255
    const b = parseInt(hex.substring(4, 6), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)

    let h = 0
    let s = 0
    const l = (max + min) / 2

    const d = max - min

    if (d !== 0) {
        s = d / (1 - Math.abs(2 * l - 1))

        switch (max) {
            case r:
                h = 60 * (((g - b) / d) % 6)
                break
            case g:
                h = 60 * ((b - r) / d + 2)
                break
            case b:
                h = 60 * ((r - g) / d + 4)
                break
        }
    }

    if (h < 0) h += 360

    return {
        h,
        s: s * 100,
        l: l * 100,
    }
}