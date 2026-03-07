// Prayer time calculation (simplified but accurate)
function toRadians(d: number) { return d * Math.PI / 180; }
function toDegrees(r: number) { return r * 180 / Math.PI; }

function sunPosition(jd: number) {
    const D = jd - 2451545.0;
    const g = (357.529 + 0.98560028 * D) % 360;
    const q = (280.459 + 0.98564736 * D) % 360;
    const L = (q + 1.915 * Math.sin(toRadians(g)) + 0.020 * Math.sin(toRadians(2 * g))) % 360;
    const e = 23.439 - 0.00000036 * D;
    const RA = toDegrees(Math.atan2(Math.cos(toRadians(e)) * Math.sin(toRadians(L)), Math.cos(toRadians(L))));
    const d = toDegrees(Math.asin(Math.sin(toRadians(e)) * Math.sin(toRadians(L))));
    return { RA, d };
}

function julianDate(year: number, month: number, day: number) {
    if (month <= 2) { year--; month += 12; }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

export function computePrayerTimes(lat: number, lng: number, date: Date, tz: number) {
    const y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
    const jd = julianDate(y, m, d);
    const { d: decl } = sunPosition(jd);

    const dtr = toRadians(decl);
    const lr = toRadians(lat);

    // Equation of time (approximate)
    const D = jd - 2451545.0;
    const g = toRadians((357.529 + 0.98560028 * D) % 360);
    const q = (280.459 + 0.98564736 * D) % 360;
    const L = (q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) % 360;
    const e = toRadians(23.439 - 0.00000036 * D);
    const RA = toDegrees(Math.atan2(Math.cos(e) * Math.sin(toRadians(L)), Math.cos(toRadians(L))));
    const EqT = (q - RA) / 15;

    const Dhuhr = 12 + tz - lng / 15 - EqT;

    function hourAngle(angle: number) {
        const cosH = (Math.sin(toRadians(angle)) - Math.sin(lr) * Math.sin(dtr)) / (Math.cos(lr) * Math.cos(dtr));
        return toDegrees(Math.acos(Math.max(-1, Math.min(1, cosH)))) / 15;
    }

    const fajrHA = hourAngle(-18);
    const sunriseHA = hourAngle(-0.833);
    const asrFactor = 1; // Shafi'i / Standard
    const asrAltitude = toDegrees(Math.atan(1 / (asrFactor + Math.tan(Math.abs(lr - dtr)))));
    const asrHA = hourAngle(asrAltitude);
    const maghribHA = hourAngle(-0.833);
    const ishaHA = hourAngle(-17);

    const normalize24 = (h: number) => {
        let result = h % 24;
        if (result < 0) result += 24;
        return result;
    };

    const toTime = (h: number) => {
        const hNorm = normalize24(h);
        const hh = Math.floor(hNorm);
        const mm = Math.floor((hNorm - hh) * 60);
        return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    };

    return {
        fajr: toTime(Dhuhr - fajrHA),
        sunrise: toTime(Dhuhr - sunriseHA),
        dhuhr: toTime(Dhuhr),
        asr: toTime(Dhuhr + asrHA),
        maghrib: toTime(Dhuhr + maghribHA),
        isha: toTime(Dhuhr + ishaHA),
    };
}
