export const isNullishOrEmptyString = (text: string | null | undefined) => {
    return typeof text === 'string' && text.length > 0;
};

export const isValidLinuxTimeStamp = (str: string) => {
    if (isNaN(Number(str))) return false;
    return new Date(str).getTime() > 0;
};

export const getDateRelativeFromNow = (
    amount: number,
    unit: 'day' | 'month' | 'year',
    optionalParam?: { setISOHourToZero: boolean }
) => {
    const tempDate = new Date();
    switch (unit) {
        case 'day':
            tempDate.setDate(new Date().getDate() + amount);
            break;
        case 'month':
            tempDate.setDate(1);
            tempDate.setMonth(new Date().getMonth() + amount);
            break;
        case 'year':
            tempDate.setDate(1);
            tempDate.setMonth(0);
            tempDate.setFullYear(new Date().getFullYear() + amount);
            break;
    }
    const finalDate = new Date(tempDate);
    finalDate.setHours(0, 0, 0, 0);
    if (optionalParam?.setISOHourToZero) {
        finalDate.setUTCHours(0, 0, 0, 0);
    }
    return finalDate;
};
