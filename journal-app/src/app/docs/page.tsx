"use client";

import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function APIDocsPage() {
  const [spec, setSpec] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/docs')
      .then((res) => res.json())
      .then((data) => {
        setSpec(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load API spec:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">📚</div>
          <p className="text-gray-600">Loading API Documentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <span>📚</span>
            Journal API Documentation
            <span>🤖</span>
          </h1>
          <p className="text-gray-600">
            Complete API reference for LifeOS Journal App - Perfect for AI agent integration
          </p>
          <div className="mt-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-400 to-cyan-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              📖 Back to Journal App
            </a>
          </div>
        </div>

        {/* Swagger UI */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {spec && (
            <SwaggerUI 
              spec={spec} 
              tryItOutEnabled={true}
              defaultModelsExpandDepth={1}
              defaultModelExpandDepth={1}
              docExpansion="list"
              filter={true}
              showExtensions={true}
              showCommonExtensions={true}
            />
          )}
        </div>

        {/* AI Integration Notes */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            🤖 AI Integration Guide
          </h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-lg mb-2">For AI Agents & LLM Tool Calling:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Create Entry:</strong> POST to <code className="bg-gray-100 px-2 py-1 rounded">/api/journal</code> with content, mood, and tags</li>
                <li><strong>Read Entries:</strong> GET from <code className="bg-gray-100 px-2 py-1 rounded">/api/journal</code> or filter by date</li>
                <li><strong>Universal Schema:</strong> All entries follow LifeOS pattern for multi-domain compatibility</li>
                <li><strong>Mood Tracking:</strong> 8 emoji categories: amazing, happy, okay, sad, angry, excited, tired, grateful</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Example AI Use Cases:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Voice-to-journal: Convert speech to journal entries automatically</li>
                <li>Daily summaries: AI reads entries and creates mood/activity insights</li>
                <li>Smart suggestions: Correlate mood patterns with activities</li>
                <li>Cross-domain analysis: Connect journal mood with meal choices, habits, etc.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}