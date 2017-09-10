export enum ScheduleMode {
    CALENDAR = 0,
    WAITING = 1,
    TUTORIAL = 2
}

/**
 * this is a decorator
 * @param constructor 
 */
export function ScheduleModeAware(constructor: Function) {
    constructor.prototype.ScheduleMode = ScheduleMode;
}