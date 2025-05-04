export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const DEFAULT_MAP_CENTER = { lat: 40.7128, lng: -74.0060 }; // New York City
export const DEFAULT_MAP_ZOOM = 13;

export const CATEGORIES = [
  'Infrastructure',
  'Safety',
  'Environment',
  'Public Services',
  'Other'
];

export const STATUS_COLORS = {
  'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
  'Resolved': 'bg-green-100 text-green-800 border-green-200'
};