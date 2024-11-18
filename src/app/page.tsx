'use client';

import { useEffect, useState } from 'react';

type CIStatus = {
  _id: string;
  stage: string;
  status: string;
  logs: string;
  time: string;
};

export default function Home() {
  const [ciStatus, setCIStatus] = useState<CIStatus[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/status');
        const data = await response.json();
        if (data.success) {
          setCIStatus(data.data);
        } else {
          console.error('Failed to fetch CI/CD status:', data.message);
        }
      } catch (error) {
        console.error('Error fetching CI/CD status:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8 font-space-mono">
          CI/CD Dashboard
        </h1>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ciStatus.length > 0 ? (
            ciStatus.map((status) => (
              <div
                key={status._id}
                className={`
                  overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl
                  ${status.status === 'Success' 
                    ? 'bg-white border-t-4 border-green-500' 
                    : 'bg-white border-t-4 border-red-500'}
                `}
              >
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 font-space-mono">
                      {status.stage}
                    </h2>
                    <span
                      className={`
                        px-3 py-1 rounded-full text-sm font-medium
                        ${status.status === 'Success'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'}
                      `}
                    >
                      {status.status}
                    </span>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2 font-space-mono">
                      Log Information:
                    </h3>
                    <div className="bg-gray-50 rounded-md p-3 font-space-mono text-sm text-gray-600 break-words">
                      {status.logs}
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    {new Date(status.time).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500 font-space-mono">Loading...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

