interface IDateUtils {
    addDaysToDate(days: number, date?: Date): Date;
    addMinutesToDate(minutes: number, date?: Date): Date;
    isDateABeforeDateB(dateA: Date, dateB: Date): boolean;
    isDateAAfterDateB(dateA: Date, dateB: Date): boolean;
    getCurrentHour(): number;
}

class NativeDateUtils implements IDateUtils {
    addDaysToDate(days: number, date?: Date): Date {
        const currDate: Date = date ?? new Date();
        currDate.setDate(currDate.getDate() + days);

        return currDate;
    }

    addMinutesToDate(minutes: number, date?: Date): Date {
        const currDate: Date = date ?? new Date();
        currDate.setMinutes(currDate.getMinutes() + minutes);

        return currDate;
    }

    isDateABeforeDateB(dateA: Date, dateB: Date): boolean {
        return dateA.getTime() <= dateB.getTime();
    }

    isDateAAfterDateB(dateA: Date, dateB: Date): boolean {
        return dateA.getTime() > dateB.getTime();
    }

    getCurrentHour(): number {
        return new Date().getUTCHours();
    }
}

const nativeDateUtils = new NativeDateUtils();

export type { IDateUtils };
export { nativeDateUtils };
