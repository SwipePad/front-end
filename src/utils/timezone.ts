export function getTimezoneInfo() {
  const now = new Date();

  // Get timezone offset in hours and minutes
  const tzOffset = -now.getTimezoneOffset();
  const tzHours = Math.floor(Math.abs(tzOffset) / 60);
  const tzMinutes = Math.abs(tzOffset) % 60;
  const tzString = `${tzOffset >= 0 ? "+" : "-"}${tzHours.toString().padStart(2, "0")}:${tzMinutes.toString().padStart(2, "0")}`;

  // Get timezone name if available
  const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return {
    timeZoneName,
    tzString,
  };
}
