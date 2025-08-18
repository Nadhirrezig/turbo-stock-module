'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient, API_CONFIG, unitsService } from '@/lib/api';

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<{
    connection: boolean | null;
    fetchUnits: boolean | null;
    createUnit: boolean | null;
    error: string | null;
  }>({
    connection: null,
    fetchUnits: null,
    createUnit: null,
    error: null,
  });

  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setTestResults({
      connection: null,
      fetchUnits: null,
      createUnit: null,
      error: null,
    });

    try {
      // Test 1: Connection Test
      console.log('=== API Connection Test ===');
      console.log('API Config:', {
        baseUrl: API_CONFIG.baseUrl,
        useMockData: API_CONFIG.useMockData,
        timeout: API_CONFIG.timeout,
      });

      const connectionResult = await apiClient.testConnection();
      setTestResults(prev => ({ ...prev, connection: connectionResult }));

      if (!connectionResult) {
        setTestResults(prev => ({ ...prev, error: 'Connection test failed' }));
        return;
      }

      // Test 2: Fetch Units
      console.log('=== Fetch Units Test ===');
      try {
        const unitsResponse = await unitsService.getAll({ page: 1, per_page: 5 });
        console.log('Units response structure:', {
          hasData: !!unitsResponse.data,
          dataLength: unitsResponse.data?.length,
          hasPagination: !!unitsResponse.pagination,
          fullResponse: unitsResponse
        });
        
        if (unitsResponse.data && Array.isArray(unitsResponse.data)) {
          setTestResults(prev => ({ ...prev, fetchUnits: true }));
        } else {
          throw new Error('Invalid response structure: missing data array');
        }
      } catch (error) {
        console.error('Fetch units error:', error);
        setTestResults(prev => ({ 
          ...prev, 
          fetchUnits: false,
          error: error instanceof Error ? error.message : 'Fetch units failed'
        }));
      }

      // Test 3: Create Unit (optional)
      console.log('=== Create Unit Test ===');
      try {
        const testUnit = {
          name: `Test Unit ${Date.now()}`,
          symbol: 'TEST',
        };
        const createResponse = await unitsService.create(testUnit);
        console.log('Create response structure:', {
          hasId: !!createResponse.id,
          hasName: !!createResponse.name,
          fullResponse: createResponse
        });
        
        if (createResponse.id && createResponse.name) {
          setTestResults(prev => ({ ...prev, createUnit: true }));
        } else {
          throw new Error('Invalid create response: missing id or name');
        }
      } catch (error) {
        console.error('Create unit error:', error);
        setTestResults(prev => ({ ...prev, createUnit: false }));
      }

    } catch (error) {
      console.error('Test suite error:', error);
      setTestResults(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: boolean | null) => {
    if (status === null) return <Badge variant="secondary">Not Run</Badge>;
    if (status === true) return <Badge variant="default" className="bg-green-500">✓ Pass</Badge>;
    return <Badge variant="destructive">✗ Fail</Badge>;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">API Connection Test</h1>
        <p className="text-muted-foreground mt-2">
          Test the connection and functionality of the backend API
        </p>
      </div>

      <div className="grid gap-6">
        {/* Configuration Info */}
        <Card>
          <CardHeader>
            <CardTitle>Current Configuration</CardTitle>
            <CardDescription>API settings and environment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Base URL:</strong> {API_CONFIG.baseUrl}
              </div>
              <div>
                <strong>Mock Mode:</strong> {API_CONFIG.useMockData ? 'Enabled' : 'Disabled'}
              </div>
              <div>
                <strong>Timeout:</strong> {API_CONFIG.timeout}ms
              </div>
              <div>
                <strong>Retry Attempts:</strong> {API_CONFIG.retryAttempts}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>API Tests</CardTitle>
            <CardDescription>Run tests to diagnose API communication issues</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runTests} 
              disabled={loading}
              className="mb-4"
            >
              {loading ? 'Running Tests...' : 'Run API Tests'}
            </Button>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded">
                <span>1. Connection Test (/health)</span>
                {getStatusBadge(testResults.connection)}
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded">
                <span>2. Fetch Units (GET /api/units)</span>
                {getStatusBadge(testResults.fetchUnits)}
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded">
                <span>3. Create Unit (POST /api/units)</span>
                {getStatusBadge(testResults.createUnit)}
              </div>
            </div>

            {testResults.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <strong>Error:</strong> {testResults.error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Response Structure Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Expected Backend Response for GET /api/units:</strong>
                <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
{`{
  "data": [
    {
      "id": "1",
      "name": "Kilogram",
      "symbol": "kg",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 5,
    "total": 1,
    "last_page": 1
  }
}`}
                </pre>
              </div>
              
              <div>
                <strong>Expected Backend Response for POST /api/units:</strong>
                <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
{`{
  "id": "generated-uuid",
  "name": "Kilogram",
  "symbol": "kg",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
