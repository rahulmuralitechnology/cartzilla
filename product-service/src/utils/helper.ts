import dayjs from "dayjs";
import crypto from "crypto";

export const calculateExpiredDays = (month: number) => {
  if (month) return dayjs().add(month, "month").toDate().toISOString();
};

export const calculateRemainingDays = (expiryDate: Date) => {
  if (expiryDate) return dayjs(expiryDate).diff(dayjs(), "days");
};

export function getFreeExpiryDate(days: number = 3) {
  const currentDate = new Date();
  const expiryDate = new Date(currentDate);
  expiryDate.setDate(currentDate.getDate() + days);
  return expiryDate;
}

export function generateApiKey(userId: string): string {
  const apiKey = `${userId}-${crypto.randomBytes(16).toString("hex")}`;
  return apiKey;
}

export function isCheckPlanExpired(expiresAt: Date) {
  const expiryDate = new Date(expiresAt);
  const currentDate = new Date();

  if (currentDate > expiryDate) {
    return true;
  }
  return false;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove consecutive hyphens
}

export function generateOrderNo(storeName: string, lastOrderNo: string): string {
  // Extract prefix from store name (first two uppercase letters)
  const prefix = storeName
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 2)
    .toUpperCase();

  // Extract numeric part from last order no
  const match = lastOrderNo.match(/\d+$/);
  const lastNumber = match ? parseInt(match[0], 10) : 0;
  const nextNumber = lastNumber + 1;

  // Pad number to keep length consistent (e.g., 8921 -> 8922)
  const paddedNumber = nextNumber.toString().padStart(match ? match[0].length : 4, "0");

  return `${prefix}${paddedNumber}`;
}
