/**
 * Helper functions for common operations
 */

import crypto from 'crypto';

export const generateCardId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = crypto.randomBytes(8).toString('hex');
  return `${timestamp}${randomStr}`.toUpperCase();
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const calculateETA = (
  distance: number,
  averageSpeed: number
): number => {
  // averageSpeed in km/h, returns minutes
  return (distance / averageSpeed) * 60;
};

export const formatPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const paginate = (page: number = 1, limit: number = 10) => {
  const offset = (page - 1) * limit;
  return { offset, limit };
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .trim();
};
