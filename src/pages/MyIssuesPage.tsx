import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, Trash2, Edit, Loader, Check } from 'lucide-react';
import { fetchMyIssues, deleteIssue } from '../services/api';
import { Issue } from '../types';
import IssueCard from '../components/IssueCard';

interface LocationState {
  message?: string;
}

const MyIssuesPage: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  const locationState = location.state as LocationState;
  
  useEffect(() => {
    if (locationState?.message) {
      setSuccessMessage(locationState.message);
      // Clear the location state
      navigate(location.pathname, { replace: true });
      
      // Auto dismiss after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [locationState, navigate, location.pathname]);
  
  const loadMyIssues = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await fetchMyIssues();
      setIssues(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load your issues');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this issue?')) return;
    
    try {
      await deleteIssue(id);
      setIssues(prev => prev.filter(issue => issue._id !== id));
      setSuccessMessage('Issue deleted successfully');
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete issue');
    }
  };
  
  const handleEdit = (id: string) => {
    navigate(`/issue/${id}/edit`);
  };
  
  useEffect(() => {
    loadMyIssues();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Issues</h1>
        <p className="text-gray-600 mt-2">View and manage issues you've reported</p>
      </div>
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 animate-fadeIn">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={() => setSuccessMessage(null)}
                  className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none"
                >
                  <span className="sr-only">Dismiss</span>
                  <span className="h-5 w-5" aria-hidden="true">×</span>
                </button>
              </div>
            </div>
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
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="w-8 h-8 text-teal-600 animate-spin" />
        </div>
      ) : issues.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No issues reported yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't reported any issues yet. Help improve your community by reporting issues that need attention!
          </p>
          <button
            onClick={() => navigate('/report')}
            className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Report an Issue
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <div key={issue._id} className="relative group">
              <IssueCard 
                issue={issue} 
                onVote={() => {}} 
                showControls={false} 
              />
              
              {issue.status === 'Pending' && (
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(issue._id)}
                    className="p-1 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(issue._id)}
                    className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyIssuesPage;