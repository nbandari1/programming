import { useEffect, useState } from 'react';

// Constants for time calculations
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365;

/**
 * Calculates the time difference between a given date and now
 * @param date Date to calculate difference from
 * @returns Time difference in milliseconds
 */
const getTimeDifference = (date: string | Date): number => {
  const timeStamp = typeof date === "string" ? new Date(date).getTime() : date.getTime();
  return Date.now() - timeStamp;
};

/**
 * Formats a time difference into a human-readable string
 * @param difference Time difference in milliseconds
 * @returns Formatted string (e.g., "2h ago", "3d ago")
 */
const formatTimeDifference = (difference: number): string => {
  if (difference < MINUTE) {
    return "just now";
  } else if (difference < HOUR) {
    const minutes = Math.floor(difference / MINUTE);
    return `${minutes}m ago`;
  } else if (difference < DAY) {
    const hours = Math.floor(difference / HOUR);
    return `${hours}h ago`;
  } else if (difference < WEEK) {
    const days = Math.floor(difference / DAY);
    return `${days}d ago`;
  } else if (difference < MONTH) {
    const weeks = Math.floor(difference / WEEK);
    return `${weeks}w ago`;
  } else if (difference < YEAR) {
    const months = Math.floor(difference / MONTH);
    return `${months}mo ago`;
  } else {
    const years = Math.floor(difference / YEAR);
    return `${years}y ago`;
  }
};

/**
 * Gets a static time ago string
 * @param date Date to calculate from
 * @returns Formatted time ago string
 */
export function getTimeAgo(date: string | Date): string {
  const difference = getTimeDifference(date);
  return formatTimeDifference(difference);
}

/**
 * Custom hook for real-time time ago updates
 * @param date Date to calculate from
 * @param updateInterval How often to update (in milliseconds)
 * @returns Time ago string that updates in real-time
 */
export function useTimeAgo(date: string | Date, updateInterval: number = 60000): string {
  const [timeAgo, setTimeAgo] = useState<string>(getTimeAgo(date));

  useEffect(() => {
    const difference = getTimeDifference(date);
    
    // Determine the appropriate update interval based on the time difference
    let interval = updateInterval;
    if (difference < MINUTE) {
      interval = SECOND; // Update every second for "just now"
    } else if (difference < HOUR) {
      interval = MINUTE; // Update every minute for "X minutes ago"
    } else if (difference < DAY) {
      interval = MINUTE * 5; // Update every 5 minutes for "X hours ago"
    }
    // For older posts, keep the default interval (1 minute)

    const timer = setInterval(() => {
      setTimeAgo(getTimeAgo(date));
    }, interval);

    return () => clearInterval(timer);
  }, [date, updateInterval]);

  return timeAgo;
}

/**
 * Formats a date into a detailed string
 * @param date Date to format
 * @returns Formatted date string (e.g., "April 15, 2024 at 3:45 PM")
 */
export function formatDetailedDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true
  });
}

/**
 * Gets both relative and detailed time
 * @param date Date to format
 * @returns Object containing both relative and detailed time
 */
export function getFullTimeInfo(date: string | Date): { relative: string; detailed: string } {
  return {
    relative: getTimeAgo(date),
    detailed: formatDetailedDate(date)
  };
} 