import dayjs, { type Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

/**
 * A unix timestamp shown as wall-clock time in the city itself.
 * `tzOffset` is OpenWeather's `timezone` field: seconds east of UTC.
 */
export const cityTime = (unix: number, tzOffset: number): Dayjs =>
  dayjs.unix(unix).utc().add(tzOffset, "second");

export const fmtDuration = (ms: number) => {
  const mins = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};
