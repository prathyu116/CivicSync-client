// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader, Filter, AlertTriangle, RefreshCw } from 'lucide-react';
import IssueCard from '../components/IssueCard';
import { fetchIssues, voteForIssue } from '../services/api'; // Make sure fetchIssues returns the new structure { items: Issue[], ... }
import { CATEGORIES } from '../config';
import { Issue } from '../types'; // Ensure Issue type matches backend
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  // Filtered issues can be derived or set simultaneously. Let's simplify for now
  // const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState<Record<string, boolean>>({}); // Track voting state per issue
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalIssues, setTotalIssues] = useState(0); // Store total for better feedback
  const [category, setCategory] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const { auth } = useAuth();

  const ITEMS_PER_PAGE = 6; // Define limit centrally

  const loadIssues = async (reset = false) => {
    setIsLoading(true);
    setError(null); // Clear previous errors

    const currentPage = reset ? 1 : page;

    try {
      // fetchIssues should return { items: Issue[], total: number, page: number, totalPages: number, hasMore: boolean }
      const result = await fetchIssues(currentPage, ITEMS_PER_PAGE, category, status);

      const newIssues = result.items || []; // Ensure it's always an array

      if (reset) {
        setIssues(newIssues);
        setTotalIssues(result.total || 0); // Update total count
        setPage(1); // Explicitly set page to 1 on reset
      } else {
        // Append new issues, preventing duplicates (though backend pagination should handle this)
        setIssues(prev => [...prev, ...newIssues]);
        // Don't reset total here
      }

      // Use the hasMore flag directly from the backend!
      setHasMore(result.hasMore !== undefined ? result.hasMore : false);

      // Increment page number ONLY if we just loaded more (not on reset) AND if there is potentially more
      // Backend 'hasMore' is the best indicator. We advance the page *number* for the *next* potential load.
      if (!reset && newIssues.length > 0) {
           setPage(prev => prev + 1);
      } else if (reset) {
            // If resetting, set page for the next load based on hasMore
           setPage(newIssues.length > 0 && result.hasMore ? 2 : 1);
      }


    } catch (err: any) {
      console.error("Error loading issues:", err);
      setError(err?.response?.data?.message || err.message || 'Failed to load issues');
      setHasMore(false); // Stop loading more on error
      if (reset) {
        setIssues([]); // Clear issues on error during reset
        setTotalIssues(0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (id: string) => {
    if (!auth.user || isVoting[id]) return; // Prevent double voting while processing

    setIsVoting(prev => ({ ...prev, [id]: true }));
    setError(null); // Clear previous errors

    try {
      // Assume voteForIssue now returns the updated Issue object from backend
      const updatedIssueFromApi = await voteForIssue(id);

      setIssues(prev =>
        prev.map(issue =>
          issue._id === id
            ? { ...updatedIssueFromApi } // Use the fresh data from API
            : issue
        )
      );
       // Also update filtered issues if you use separate state
      // setFilteredIssues(...)

    } catch (err: any) {
        console.error("Vote error:", err);
        // Prioritize backend error message
        const backendError = err?.response?.data?.message;
        setError(backendError || err.message || 'Failed to vote for issue');

        // Optionally revert optimistic update here if you did one
    } finally {
        setIsVoting(prev => ({ ...prev, [id]: false }));
    }
  };

  const applyFilters = () => {
    loadIssues(true); // Pass true to reset pagination and issues
  };

  const clearFilters = () => {
    setCategory('');
    setStatus('');
    setShowFilters(false);
    loadIssues(true); // Pass true to reset
  };

  // Initial load effect
  useEffect(() => {
    loadIssues(true); // Initial load always resets
  }, []); // Runs only once on mount

  // Re-derive filteredIssues whenever issues, category, or status change if not done in loadIssues
  // For simplicity, we're assuming loadIssues with filters does the job
  const filteredIssues = issues; // In this version, loadIssues updates the main 'issues' state


  // Display Logic: Use `issues` state directly since loadIssues filters it
  const issuesToShow = issues;


  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... (Header, Filter Button, Report Button) ... */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Issues</h1>
          <p className="text-gray-600 mt-2">Browse and vote on issues in your community ({totalIssues} total found based on filters)</p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {/* Indicate if filters are active? */}
            {(category || status) && <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>}
          </button>

          {auth.user && (
            <Link
              to="/report"
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report Issue</span>
            </Link>
          )}
        </div>
      </div>


      {/* ... (Filter Panel - remains the same) ... */}
      {showFilters && (
         <div className="bg-white p-4 rounded-lg shadow-md mb-6 animate-fadeIn">
            {/* ... Filter controls ... */}
             <h2 className="text-lg font-semibold mb-4">Filter Issues</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category-filter"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status-filter"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
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
                 Clear Filters
               </button>
               <button
                 onClick={applyFilters}
                 disabled={isLoading}
                 className="px-4 py-2 text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors disabled:opacity-50"
               >
                {isLoading ? 'Filtering...' : 'Apply Filters'}
               </button>
            </div>
         </div>
      )}


      {/* ... (Error Display - remains the same) ... */}
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
                          onClick={() => loadIssues(true)} // Retry clears errors and reloads page 1
                          title="Retry Loading Issues"
                          className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none"
                        >
                          <RefreshCw className="h-5 w-5" />
                          <span className="sr-only">Retry</span>
                        </button>
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

      {/* --- CONDITION TO CHECK DATA --- */}
      {/* Check after loading finishes and there's no error, OR if still loading initial data */}
      {!isLoading && !error && issuesToShow.length === 0 ? ( // Check the derived/correct state
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No issues found</h3>
          <p className="text-gray-600 mb-6">
            {category || status
              ? "No issues match your current filters. Try clearing them."
              : "No issues have been reported yet. Be the first!"}
          </p>

          {auth.user && (
            <Link
              to="/report"
              className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Report an Issue
            </Link>
          )}
        </div>
      ) : (
        // Only render grid if there are issues or if it's the initial load
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {issuesToShow.map((issue) => ( // Render the correct state
            <IssueCard
              key={issue._id}
              issue={issue}
              onVote={handleVote}
              // Add disabled state based on isVoting if desired in IssueCard
              // isDisabled={isVoting[issue._id]}
            />
          ))}
          {/* Placeholder for loading more items */}
          {isLoading && page > 1 && (
              [...Array(3)].map((_, index) => ( // Show a few loading placeholders
                  <div key={`loading-${index}`} className="bg-white rounded-lg shadow-md p-5 animate-pulse">
                     <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                     <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                     <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3 mb-4"></div>
                     <div className="flex justify-between items-center mt-4">
                       <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                       <div className="h-8 bg-indigo-100 rounded-full w-16"></div>
                    </div>
                 </div>
             ))
          )}
        </div>
      )}

       {/* --- ADJUSTED Load More Button Condition --- */}
       {/* Show button only if loading is NOT active AND hasMore is true */}
      {!isLoading && hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => loadIssues()} // Load next page
            // Disable should ideally not be needed if !isLoading covers it
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors disabled:opacity-50"
          >
             Load More Issues
          </button>
        </div>
      )}
      {/* Optional: Indicate end of list */}
      {!isLoading && !hasMore && issuesToShow.length > 0 && (
          <div className="mt-8 text-center text-gray-500">
             End of issues.
          </div>
      )}

       {/* Display initial loading spinner */}
       {isLoading && issues.length === 0 && (
             <div className="flex justify-center items-center py-12">
              <Loader className="w-8 h-8 text-teal-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading issues...</span>
            </div>
        )}

    </div>
  );
};

export default HomePage;