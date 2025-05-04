import React from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Issue } from '../types';
import { STATUS_COLORS } from '../config';
import { useAuth } from '../contexts/AuthContext';

interface IssueCardProps {
  issue: Issue;
  onVote: (id: string) => void;
  showControls?: boolean;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onVote, showControls = true }) => {
  const { auth } = useAuth();
  const hasVoted = auth.user && issue.votedBy.includes(auth.user._id);
  const isAuthor = auth.user && (typeof issue.createdBy === 'string' 
    ? issue.createdBy === auth.user._id 
    : issue.createdBy._id === auth.user._id);

  const statusClass = STATUS_COLORS[issue.status] || 'bg-gray-100 text-gray-800';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
      {issue.imageUrl && (
        <div className="h-40 overflow-hidden">
          <img 
            src={issue.imageUrl} 
            alt={issue.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{issue.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${statusClass}`}>
            {issue.status}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{issue.description}</p>
        
        <div className="flex items-center text-gray-500 text-xs mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="truncate">
            {issue.location.address || `${issue.location.lat.toFixed(6)}, ${issue.location.lng.toFixed(6)}`}
          </span>
        </div>
        
        <div className="flex items-center text-gray-500 text-xs mb-4">
          <Clock className="w-4 h-4 mr-1" />
          <span>{format(new Date(issue.createdAt), 'MMM d, yyyy')}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <Link 
            to={`/issue/${issue._id}`}
            className="text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors"
          >
            View Details
          </Link>
          
          {showControls && auth.user && (
            <button
              onClick={() => onVote(issue._id)}
              disabled={hasVoted}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                hasVoted 
                  ? 'bg-indigo-100 text-indigo-600 cursor-default' 
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{issue.votes}</span>
            </button>
          )}
          
          {!showControls && (
            <div className="flex items-center space-x-1 text-indigo-600">
              <ThumbsUp className="w-4 h-4" />
              <span>{issue.votes}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueCard;