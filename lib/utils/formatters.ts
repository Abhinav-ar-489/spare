export function formatCurrency(
  amount: number | null | undefined,
  currency: string = "AED"
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "Enquire for Price";
  }

  const curr = currency || "AED";

  try {
    return `${curr} ${new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(amount)}`;
  } catch {
    return `${curr} ${amount.toLocaleString()}`;
  }
}

export function formatPartNumber(partNumber: string): string {
  if (!partNumber) return "";
  return partNumber.toUpperCase().trim();
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
}
