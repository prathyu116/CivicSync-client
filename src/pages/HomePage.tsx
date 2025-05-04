import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader, Filter, AlertTriangle, RefreshCw } from 'lucide-react';
import IssueCard from '../components/IssueCard';
import { fetchIssues, voteForIssue } from '../services/api'; 
import { CATEGORIES } from '../config';
import { Issue } from '../types'; 
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState<Record<string, boolean>>({}); 
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalIssues, setTotalIssues] = useState(0); 
  const [category, setCategory] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const { auth } = useAuth();

  const ITEMS_PER_PAGE = 6; 

  const loadIssues = async (reset = false) => {
    setIsLoading(true);
    setError(null); 

    const currentPage = reset ? 1 : page;

    try {
      const result = await fetchIssues(currentPage, ITEMS_PER_PAGE, category, status);

      const newIssues = result.items || []; 

      if (reset) {
        setIssues(newIssues);
        setTotalIssues(result.total || 0); 
        setPage(1);
      } else {
        setIssues(prev => [...prev, ...newIssues]);
      }

      setHasMore(result.hasMore !== undefined ? result.hasMore : false);

      
      if (!reset && newIssues.length > 0) {
           setPage(prev => prev + 1);
      } else if (reset) {
           setPage(newIssues.length > 0 && result.hasMore ? 2 : 1);
      }


    } catch (err: any) {
      console.error("Error loading issues:", err);
      setError(err?.response?.data?.message || err.message || 'Failed to load issues');
      setHasMore(false); 
      if (reset) {
        setIssues([]); 
        setTotalIssues(0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (id: string) => {
    if (!auth.user || isVoting[id]) return; 

    setIsVoting(prev => ({ ...prev, [id]: true }));
    setError(null);
    try {
      const updatedIssueFromApi = await voteForIssue(id);

      setIssues(prev =>
        prev.map(issue =>
          issue._id === id
            ? { ...updatedIssueFromApi } 
            : issue
        )
      );
       

    } catch (err: any) {
        console.error("Vote error:", err);
        const backendError = err?.response?.data?.message;
        setError(backendError || err.message || 'Failed to vote for issue');

    } finally {
        setIsVoting(prev => ({ ...prev, [id]: false }));
    }
  };

  const applyFilters = () => {
    loadIssues(true); 
  };

  const clearFilters = () => {
    setCategory('');
    setStatus('');
    setShowFilters(false);
    loadIssues(true); 
  };

  useEffect(() => {
    loadIssues(true); 
  }, []); 

  
  const filteredIssues = issues; 


  const issuesToShow = issues;


  return (
    <div className="container mx-auto px-4 py-8">
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


      {showFilters && (
         <div className="bg-white p-4 rounded-lg shadow-md mb-6 animate-fadeIn">
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
                          onClick={() => loadIssues(true)} 
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

     
      {!isLoading && !error && issuesToShow.length === 0 ? ( 
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {issuesToShow.map((issue) => ( 
            <IssueCard
              key={issue._id}
              issue={issue}
              onVote={handleVote}
            
            />
          ))}
          {isLoading && page > 1 && (
              [...Array(3)].map((_, index) => ( 
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

      
      {!isLoading && hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => loadIssues()} 
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors disabled:opacity-50"
          >
             Load More Issues
          </button>
        </div>
      )}
      {!isLoading && !hasMore && issuesToShow.length > 0 && (
          <div className="mt-8 text-center text-gray-500">
             {/* End of issues. */}
          </div>
      )}

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