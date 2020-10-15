enum DurVal {
    SEC = 1000,
    MIN = 60000,
    HOUR = 3600000,
    DAY = 86400000,
    WEEK = 604800000,
    YEAR = 31557600000
}

let durStr = {
    'y': ['years', 'year', 'yrs', 'yr', 'y'],
    'w': ['weeks', 'week', 'w'],
    'd': ['days', 'day', 'd'],
    'h': ['hours', 'hour', 'hrs', 'hr', 'h'],
    'm': ['minutes', 'minute', 'mins', 'min', 'm'],
    's': ['seconds', 'second', 'secs', 'sec', 's'],
    'ms': ['milliseconds', 'milliseconds', 'ms']
};

let seperator = /(\d)+\s?(milliseconds|millisecond|ms|seconds|second|secs|sec|s|minutes|minute|mins|min|m|hours|hour|hrs|hr|h|days|day|d|weeks|week|w|years|year|yrs|yr|y){1}/gi;

export function parseNum(duration: number, mode?: ('long'|'short')) {
    let result = '';
    let remaining = duration;
    let v = 0;
    if (remaining >= DurVal.YEAR) {
        v = Math.floor(remaining / DurVal.YEAR);
        result += `${v}${mode === 'long' ? pluralize('year', v) : 'y '}`;
        remaining = remaining - (v * DurVal.YEAR)
    }
    if (remaining >= DurVal.WEEK) {
        v = Math.floor(remaining / DurVal.WEEK);
        result += `${v}${mode === 'long' ? pluralize('week', v) : 'w '}`;
        remaining = remaining - (v * DurVal.WEEK)
    }
    if (remaining >= DurVal.DAY) {
        v = Math.floor(remaining / DurVal.DAY);
        result += `${v}${mode === 'long' ? pluralize('day', v) : 'd '}`;
        remaining = remaining - (v * DurVal.DAY)
    }
    if (remaining >= DurVal.HOUR) {
        v = Math.floor(remaining / DurVal.HOUR);
        result += `${v}${mode === 'long' ? pluralize('hour', v) : 'h '}`;
        remaining = remaining - (v * DurVal.HOUR)
    }
    if (remaining >= DurVal.MIN) {
        v = Math.floor(remaining / DurVal.MIN);
        result += `${v}${mode === 'long' ? pluralize('minute', v) : 'm '}`;
        remaining = remaining - (v * DurVal.MIN)
    }
    if (remaining >= DurVal.SEC) {
        v = Math.floor(remaining / DurVal.SEC);
        result += `${v}${mode === 'long' ? pluralize('second', v) : 's '}`;
        remaining = remaining - (v * DurVal.SEC)
    }
    if (remaining > 0) {
        result += `${remaining}${mode === 'long' ? pluralize('millisecond', remaining) : 'ms '}`;
    }

    return result.trimEnd();
}

export function parseStr(duration: string) {
    let matches;
    let result = 0;
    do {
        matches = seperator.exec(duration);
        if (matches !== null) {
            let n = parseInt(matches[1]);
            let durType = matches[2];

            if (durStr.y.includes(durType)) result += n * DurVal.YEAR;
            if (durStr.w.includes(durType)) result += n * DurVal.WEEK;
            if (durStr.d.includes(durType)) result += n * DurVal.DAY;
            if (durStr.h.includes(durType)) result += n * DurVal.HOUR;
            if (durStr.m.includes(durType)) result += n * DurVal.MIN;
            if (durStr.s.includes(durType)) result += n * DurVal.SEC;
            if (durStr.ms.includes(durType)) result += n;
        }
    } while(matches);

    return result;
}

function pluralize(str: string, val: number) {
    if (val > 1) return ` ${str}s `;
    else return ` ${str} `;
}