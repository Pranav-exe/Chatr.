export function extractTime(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid time";

  let hours = date.getHours();
  const minutes = padZero(date.getMinutes());
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert 24-hour to 12-hour format
  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${hours}:${minutes} ${ampm}`;
}

function padZero(number: number): string {
  return number.toString().padStart(2, "0");
}