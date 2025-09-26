export class AppError extends Error {
    constructor(
        public status: number,
        public message: string,
        public asText: boolean = false,
        public payload?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'AppError';
    }
}
