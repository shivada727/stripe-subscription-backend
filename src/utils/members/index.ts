export function toStatusMap(rows: Array<{ _id: string; numeric: number }>) {
    const map: Record<string, number> = {};

    for (const { _id, numeric } of rows) map[_id] = numeric;

    return map;
}

export function countUsedSeats(byStatus: Record<string, number>) {
    return (
        (byStatus.pending ?? 0) +
        (byStatus.active ?? 0) +
        (byStatus.past_due ?? 0) +
        (byStatus.paused ?? 0)
    );
}

export function computeSeats(
    capacity: number,
    byStatus: Record<string, number>
) {
    const usedSeats = countUsedSeats(byStatus);

    const freeSeats = Math.max(0, capacity - usedSeats);

    return { usedSeats, freeSeats, byStatus };
}
