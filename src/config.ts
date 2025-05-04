export const API_URL = import.meta.env.VITE_API_URL 

export const DEFAULT_MAP_CENTER = { lat: 22.5937, lng: 78.9629 }; // India
export const DEFAULT_MAP_ZOOM = 5; 
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