import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  AlertTriangle, MapPin, Calendar, Clock, Tag, User, ThumbsUp,
  ArrowLeft, Loader, Edit, Send, PlayCircle, CheckCircle 
} from 'lucide-react'; 
import { format } from 'date-fns';
import MapView from '../components/MapView';
import { fetchIssueById, voteForIssue, updateIssueStatus } from '../services/api'; 
import { STATUS_COLORS } from '../config';
import { Issue } from '../types';
import { useAuth } from '../contexts/AuthContext';

const IssueDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false); 
  const { auth } = useAuth();

  const loadIssue = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchIssueById(id);
      setIssue(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load issue details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async () => {
    if (!id || !auth.user || !issue) return;

    const hasVoted = issue.votedBy.includes(auth.user._id);
    if (hasVoted) return;

    try {
      const updatedIssue = await voteForIssue(id);
      setIssue(updatedIssue); 
    } catch (err: any) {
      setError(err.message || 'Failed to vote for issue');
    }
  };

  const handleStatusUpdate = async (newStatus: 'In Progress' | 'Resolved') => {
    if (!id || !auth.user || !issue || !isAuthor || issue.status === newStatus || isUpdatingStatus) return;

    if (issue.status === 'Resolved' && newStatus === 'In Progress') {
        setError('Cannot revert status from Resolved.');
        return;
    }

    setIsUpdatingStatus(true);
    setError(null); 

    try {
      const updatedIssue = await updateIssueStatus(id, newStatus);
      console.log("djdj",updateIssueStatus)
      setIssue(updatedIssue); 
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to update status to ${newStatus}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  useEffect(() => {
    loadIssue();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error || 'Issue not found'}</p>
              </div>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center text-teal-600 hover:text-teal-800"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to issues
          </Link>
        </div>
      </div>
    );
  }

  const hasVoted = auth.user && issue.votedBy.includes(auth.user._id);
  const isAuthor = auth.user && (typeof issue.createdBy === 'string'
    ? issue.createdBy === auth.user._id
    : issue.createdBy._id === auth.user._id);
  const statusClass = STATUS_COLORS[issue.status] || 'bg-gray-100 text-gray-800';
  const createdByName = typeof issue.createdBy === 'string'
    ? 'Unknown User'
    : issue.createdBy.name;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-teal-600 hover:text-teal-800"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to issues
          </Link>
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


        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {issue.imageUrl && (
            <div className="h-64 overflow-hidden">
              <img
                src={issue.imageUrl}
                alt={issue.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
              <span className={`text-sm px-3 py-1 rounded-full ${statusClass}`}>
                {issue.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2">
                <p className="text-gray-700 mb-6 whitespace-pre-line">{issue.description}</p>

                <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-teal-600" />
                    <span>{issue.category}</span>
                  </div>

                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-teal-600" />
                    <span>{createdByName}</span>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-teal-600" />
                    <span>{format(new Date(issue.createdAt), 'MMMM d, yyyy')}</span>
                  </div>

                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-teal-600" />
                    <span>{format(new Date(issue.createdAt), 'h:mm a')}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                 <div className="bg-gray-50 p-4 rounded-lg mb-1"> 
                   <h3 className="font-medium text-gray-900 mb-2">Issue Location</h3>
                   <div className="flex items-center text-sm text-gray-600 mb-3">
                     <MapPin className="w-4 h-4 mr-2 text-teal-600" />
                     <span>
                       {issue.location.address ||
                         `${issue.location.lat.toFixed(6)}, ${issue.location.lng.toFixed(6)}`}
                     </span>
                     
                   </div>
                 </div>

                 {auth.user && (
                   <div className="space-y-3">
                     <button
                       onClick={handleVote}
                       disabled={hasVoted || isUpdatingStatus} 
                       className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                         hasVoted
                           ? 'bg-indigo-100 text-indigo-600 cursor-default'
                           : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                       } disabled:opacity-50`}
                     >
                       <ThumbsUp className="w-5 h-5" />
                       <span>{hasVoted ? 'Supported' : 'Support this issue'}</span>
                       <span className="font-semibold ml-1">({issue.votes})</span>
                     </button>

                     {isAuthor && (
                         <>
                           {issue.status === 'Pending' && (
                             <Link
                               to={`/issue/${issue._id}/edit`}
                               aria-disabled={isUpdatingStatus}
                               className={`w-full flex items-center justify-center space-x-2 py-2 px-4 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-md transition-colors ${isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                               <Edit className="w-5 h-5" />
                               <span>Edit this issue</span>
                              </Link>
                           )}

                          {issue.status !== 'Resolved' && ( 
                             <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                               {issue.status === 'Pending' && (
                                <button
                                  onClick={() => handleStatusUpdate('In Progress')}
                                  disabled={isUpdatingStatus}
                                  className="w-full flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors disabled:opacity-50"
                                >
                                  {isUpdatingStatus ? <Loader className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-5 h-5" />}
                                  <span>Mark as In Progress</span>
                                </button>
                               )}
                               {issue.status !== 'Resolved' && ( 
                                <button
                                  onClick={() => handleStatusUpdate('Resolved')}
                                  disabled={isUpdatingStatus}
                                  className="w-full flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-green-100 text-green-700 hover:bg-green-200 rounded-md transition-colors disabled:opacity-50"
                                >
                                  {isUpdatingStatus ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                  <span>Mark as Resolved</span>
                                </button>
                               )}
                             </div>
                          )}
                         </>
                     )}
                   </div>
                 )}
              </div>

            </div>

            <div className="h-64 mt-6">
              <h3 className="font-medium text-gray-900 mb-3">Issue on Map</h3>
              <MapView
                issues={[issue]}
                height="250px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailsPage;