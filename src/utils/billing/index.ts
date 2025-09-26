export function resolveFutureMonthlyAnchor(anchorAt: number): number {
    const nowInSeconds = Math.floor(Date.now() / 1000);

    if (!Number.isFinite(anchorAt)) {
        return nowInSeconds + 60;
    }

    if (anchorAt > nowInSeconds) {
        return Math.floor(anchorAt);
    }

    const baseDate = new Date(anchorAt * 1000);
    const nowDate = new Date(nowInSeconds * 1000);

    const targetDay = baseDate.getUTCDate();
    const targetHour = baseDate.getUTCHours();
    const targetMinute = baseDate.getUTCMinutes();
    const targetSecond = baseDate.getUTCSeconds();

    let year = nowDate.getUTCFullYear();
    let month = nowDate.getUTCMonth() + 1;

    if (month > 11) {
        month = 0;
        year += 1;
    }

    const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const scheduledDay = Math.min(targetDay, lastDayOfMonth);

    const nextAnchor = Math.floor(
        Date.UTC(
            year,
            month,
            scheduledDay,
            targetHour,
            targetMinute,
            targetSecond
        ) / 1000
    );

    if (nextAnchor > nowInSeconds) {
        return nextAnchor;
    }

    return nowInSeconds + 60;
}
