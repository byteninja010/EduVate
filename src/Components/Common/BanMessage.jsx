import React from 'react';
import { VscWarning, VscMail, VscSignOut } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';

const BanMessage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-richblack-800 rounded-2xl p-8 max-w-md w-full mx-4 border-2 border-red-500/30 shadow-2xl">
        <div className="text-center">
          {/* Warning Icon */}
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
             <VscWarning style={{ color: '#dc2626' }} className="text-4xl" />
          </div>
          
          {/* Title */}
          <h1 style={{ color: '#dc2626' }} className="text-2xl font-bold mb-4">
            Account Banned
          </h1>
          
          {/* Message */}
          <p className="text-richblack-300 mb-6 leading-relaxed">
            Your account has been suspended due to violation of our platform policies. 
            You are no longer able to access EduVate services.
          </p>
          
          {/* Contact Info */}
          <div className="bg-richblack-700/50 rounded-lg p-4 mb-6 border border-red-500/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <VscMail className="text-yellow-25" />
              <span className="text-yellow-25 font-semibold">Contact Administration</span>
            </div>
            <p className="text-richblack-200 text-sm">
              Email: <span className="text-yellow-25 font-medium">admin@eduvate.in</span>
            </p>
            <p className="text-richblack-300 text-xs mt-1">
              Please provide your user ID and reason for appeal
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-200"
            >
              <VscSignOut className="text-lg" />
              Sign Out
            </button>
            
            <button
              onClick={() => window.open('mailto:admin@eduvate.in?subject=Account Appeal - Banned User&body=Please provide your user ID and reason for appeal', '_blank')}
              className="w-full px-6 py-3 bg-yellow-25 text-richblack-900 rounded-lg font-medium hover:bg-yellow-25/90 transition-all duration-200"
            >
              Send Appeal Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BanMessage;
