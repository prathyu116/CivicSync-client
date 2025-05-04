import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, MapPin, Upload, Send } from 'lucide-react';
import MapView from '../components/MapView';
import { fetchIssueById, updateIssue } from '../services/api';
import { CATEGORIES } from '../config';
import { Issue } from '../types';

const EditIssuePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Issue['category']>();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadIssue = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await fetchIssueById(id);
        setIssue(data);
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setSelectedLocation(data.location);
        setImageUrl(data.imageUrl || '');
      } catch (err: any) {
        setError(err.message || 'Failed to load issue');
      } finally {
        setIsLoading(false);
      }
    };

    loadIssue();
  }, [id]);

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setSelectedLocation(location);
  };

  const validateForm = () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return false;
    }
    if (!description.trim()) {
      setError('Please enter a description');
      return false;
    }
    if (!category) {
      setError('Please select a category');
      return false;
    }
    if (!selectedLocation) {
      setError('Please select a location on the map');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !id) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await updateIssue(id, {
        title,
        description,
        category,
        location: selectedLocation!,
        imageUrl: imageUrl || undefined
      });
      
      navigate('/my-issues', { 
        state: { message: 'Issue updated successfully!' } 
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update issue');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">Issue not found</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Issue</h1>
          <p className="text-gray-600 mt-2">
            Update the details of your reported issue
          </p>
        </div>
        
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
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="Brief title of the issue"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="Provide details about the issue..."
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL (optional)
            </label>
            <div className="flex">
              <input
                type="text"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-l-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="https://example.com/image.jpg"
              />
              <div className="flex items-center justify-center px-4 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md">
                <Upload className="w-5 h-5 text-gray-500" />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Please provide a direct URL to an image of the issue
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location * <span className="text-sm font-normal text-gray-500">(Click on the map to update)</span>
            </label>
            <div className="relative border border-gray-300 rounded-lg overflow-hidden">
              <MapView 
                selectable={true}
                onLocationSelect={handleLocationSelect}
                selectedLocation={selectedLocation}
                height="400px"
              />
            </div>
            
            {selectedLocation && (
              <div className="mt-2 text-sm text-gray-600">
                Selected location: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/my-issues')}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Updating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Update Issue
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIssuePage;