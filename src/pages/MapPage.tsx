import React, { useState, useEffect } from 'react';
import { AlertTriangle, Loader, Filter } from 'lucide-react';
import MapView from '../components/MapView';
import { fetchIssues } from '../services/api';
import { CATEGORIES } from '../config';
import { Issue } from '../types';

const MapPage: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  const loadIssues = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await fetchIssues(1, 50, category, status);
      setIssues(result.items);
    } catch (err: any) {
      setError(err.message || 'Failed to load issues');
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyFilters = () => {
    loadIssues();
  };
  
  const clearFilters = () => {
    setCategory('');
    setStatus('');
    setShowFilters(false);
    loadIssues();
  };
  
  useEffect(() => {
    loadIssues();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Map View</h1>
          <p className="text-gray-600 mt-2">View issues across your community</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 animate-fadeIn">
          <h2 className="text-lg font-semibold mb-4">Filter Issues</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Clear
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none"
                >
                  <span className="sr-only">Dismiss</span>
                  <span className="h-5 w-5" aria-hidden="true">×</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-[600px]">
            <Loader className="w-8 h-8 text-teal-600 animate-spin" />
          </div>
        ) : (
          <MapView 
            issues={issues} 
            height="600px"
          />
        )}
      </div>
      
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Map Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 rounded-full bg-amber-500 mr-2"></span>
            <span className="text-sm text-gray-700">Pending Issues</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 rounded-full bg-blue-500 mr-2"></span>
            <span className="text-sm text-gray-700">In Progress Issues</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 rounded-full bg-green-500 mr-2"></span>
            <span className="text-sm text-gray-700">Resolved Issues</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;