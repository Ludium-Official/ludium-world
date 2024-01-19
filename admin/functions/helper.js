export function getTimeStamp(originalDateString) {
  const originalDate = new Date(originalDateString);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // 24시간 형식 사용
    timeZone: "Asia/Seoul",
  }).format(originalDate);

  const splittedDate = formattedDate.replaceAll(", ", "/").split("/");

  return `${splittedDate[2]}-${splittedDate[0]}-${splittedDate[1]} ${splittedDate[3]}`;
}
