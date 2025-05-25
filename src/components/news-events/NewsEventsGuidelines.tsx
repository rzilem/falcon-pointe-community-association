
import React from "react";

const NewsEventsGuidelines = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Community Guidelines</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3">Event Registration</h3>
              <p className="text-gray-600">
                Most events require advance registration through the resident portal. 
                Sign up early as space may be limited for certain activities.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3">Guest Policy</h3>
              <p className="text-gray-600">
                Residents are welcome to bring guests to most community events. 
                Please check individual event details for guest policies and fees.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3">Weather & Updates</h3>
              <p className="text-gray-600">
                Outdoor events may be rescheduled due to inclement weather. 
                Check this page regularly for the latest announcements and updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsEventsGuidelines;
