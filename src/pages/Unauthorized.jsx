import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { VscShield, VscArrowLeft, VscHome } from 'react-icons/vsc';

const Unauthorized = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  return (
    <div className="min-h-screen bg-richblack-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8">
          <VscShield className="text-8xl text-yellow-25 mx-auto" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-richblack-5 mb-4">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-richblack-300 mb-8 leading-relaxed">
          You don't have permission to access this page. 
          Please contact an administrator if you believe this is an error.
        </p>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-richblack-800 rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-richblack-400 mb-2">Debug Info:</p>
            <p className="text-xs text-richblack-300">
              Attempted to access: {from}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 bg-yellow-25 text-richblack-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-50 transition-all duration-200"
          >
            <VscHome className="text-lg" />
            Go to Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 bg-richblack-800 text-richblack-100 px-6 py-3 rounded-lg font-semibold hover:bg-richblack-700 transition-all duration-200 border border-richblack-600"
          >
            <VscArrowLeft className="text-lg" />
            Go Back
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-6 border-t border-richblack-700">
          <p className="text-sm text-richblack-400 mb-2">
            Need help? Contact support
          </p>
          <Link 
            to="/contact" 
            className="text-yellow-25 hover:text-yellow-50 text-sm font-medium transition-colors duration-200"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
