export const formatLastSeen = (dateString: string): string => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Unknown";

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffInDays === 0) {
    return `Today at ${time}`;
  } else if (diffInDays === 1) {
    return `Yesterday at ${time}`;
  } else if (diffInDays < 7) {
    return `${date.toLocaleDateString([], { weekday: "long" })} at ${time}`;
  } else {
    return `${date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })} at ${time}`;
  }
};
