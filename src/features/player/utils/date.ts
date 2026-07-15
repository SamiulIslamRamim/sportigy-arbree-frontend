import { displayValue } from "./display-values";

export function formatBirthday(birthday: string | null | undefined): string {
  if (!birthday) return displayValue(null);
  const date = new Date(birthday);
  if (Number.isNaN(date.getTime())) return displayValue(null);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function calculateAge(birthday: string | null | undefined): number | null {
  if (!birthday) return null;
  const date = new Date(birthday);
  if (Number.isNaN(date.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - date.getFullYear();
  const m = now.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < date.getDate())) age--;
  return age;
}

export function formatAgeWithBirthday(
  birthday: string | null | undefined,
): string {
  const age = calculateAge(birthday);
  if (age === null) return displayValue(null);
  return `${age} (${formatBirthday(birthday)})`;
}

export function toDateInputValue(birthday: string | null | undefined): string {
  if (!birthday) return "";
  const date = new Date(birthday);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}
