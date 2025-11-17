/**
 * Utility functions for working with dates, especially for Persian (Jalali) calendar
 */

import jalaali from 'jalaali-js';

/**
 * Convert a Gregorian date to Jalali (Persian) date
 * @param {Date} date - JavaScript Date object
 * @returns {Object} - Object containing Jalali year, month, and day
 */
export const convertToJalali = (date) => {
  const gregorianYear = date.getFullYear();
  const gregorianMonth = date.getMonth() + 1; // JavaScript months are 0-indexed
  const gregorianDay = date.getDate();
  
  const jalaliDate = jalaali.toJalaali(gregorianYear, gregorianMonth, gregorianDay);
  
  return {
    year: jalaliDate.jy,
    month: jalaliDate.jm,
    day: jalaliDate.jd
  };
};

/**
 * Convert a Jalali (Persian) date to Gregorian date
 * @param {number} year - Jalali year
 * @param {number} month - Jalali month (1-12)
 * @param {number} day - Jalali day
 * @returns {Date} - JavaScript Date object
 */
export const convertToGregorian = (year, month, day) => {
  const gregorianDate = jalaali.toGregorian(year, month, day);
  return new Date(gregorianDate.gy, gregorianDate.gm - 1, gregorianDate.gd);
};

/**
 * Format a date as a Persian date string
 * @param {Date} date - JavaScript Date object
 * @returns {string} - Formatted Persian date string (e.g., "1402/03/14")
 */
export const formatJalaliDate = (date) => {
  const jalaliDate = convertToJalali(date);
  return `${jalaliDate.year}/${String(jalaliDate.month).padStart(2, '0')}/${String(jalaliDate.day).padStart(2, '0')}`;
};

/**
 * Format a date and time as a Persian date and time string
 * @param {Date} date - JavaScript Date object
 * @returns {string} - Formatted Persian date and time string (e.g., "1402/03/14 14:30")
 */
export const formatJalaliDateTime = (date) => {
  const jalaliDate = convertToJalali(date);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${jalaliDate.year}/${String(jalaliDate.month).padStart(2, '0')}/${String(jalaliDate.day).padStart(2, '0')} ${hours}:${minutes}`;
};

/**
 * Format a Gregorian date and time as a string (YYYY/MM/DD - HH:MM) with English numbers
 * @param {Date} date - JavaScript Date object
 * @returns {string} - Formatted Gregorian date and time string (e.g., "2023/10/27 - 14:30")
 */
export const formatGregorianDateTime = (date) => {
  if (!date) return '-';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}/${month}/${day} - ${hours}:${minutes}`;
};

/**
 * Calculate the remaining time until a future date
 * @param {Date} futureDate - Future JavaScript Date object
 * @returns {string} - Formatted remaining time in Persian (e.g., "3 روز و 5 ساعت و 20 دقیقه")
 */
export const getRemainingTime = (futureDate) => {
  const now = new Date();
  if (futureDate <= now) {
    return "0";
  }
  
  const timeDiff = futureDate - now;
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days} روز و ${hours} ساعت و ${minutes} دقیقه`;
  } else if (hours > 0) {
    return `${hours} ساعت و ${minutes} دقیقه`;
  } else {
    return `${minutes} دقیقه`;
  }
};

/**
 * Parse an ISO date string and return a Date object
 * @param {string} isoString - ISO date string
 * @returns {Date} - JavaScript Date object
 */
export const parseISODate = (isoString) => {
  if (!isoString) return null;
  return new Date(isoString);
}; 