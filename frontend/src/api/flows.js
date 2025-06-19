// frontend/src/api/flows.js

// This will be our API base URL. In a real app, this would come from environment variables.
const API_BASE_URL = 'http://localhost:8000'; // Replace with your FastAPI backend URL

// Helper to get Firebase ID token
async function getAuthToken(auth) {
  if (auth && auth.currentUser) {
    return await auth.currentUser.getIdToken();
  }
  return null;
}

// Helper for making authenticated requests
async function fetchAuthenticated(url, options = {}, auth) {
  const token = await getAuthToken(auth);
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    // If no token, and it's a protected route, the backend will handle 401.
    // For now, we'll just log a warning.
    console.warn('No authentication token available for request to:', url);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.detail || errorData.message || 'API request failed');
  }

  // Handle 204 No Content for delete operations
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// --- Flow API Operations ---

export const getFlows = async (auth) => {
  return fetchAuthenticated(`${API_BASE_URL}/flows`, { method: 'GET' }, auth);
};

export const createFlow = async (flowData, auth) => {
  return fetchAuthenticated(`${API_BASE_URL}/flows`, {
    method: 'POST',
    body: JSON.stringify(flowData),
  }, auth);
};

export const getFlowById = async (flowId, auth) => {
  return fetchAuthenticated(`${API_BASE_URL}/flows/${flowId}`, { method: 'GET' }, auth);
};

export const updateFlow = async (flowId, flowData, auth) => {
  return fetchAuthenticated(`${API_BASE_URL}/flows/${flowId}`, {
    method: 'PUT',
    body: JSON.stringify(flowData),
  }, auth);
};

export const deleteFlow = async (flowId, auth) => {
  return fetchAuthenticated(`${API_BASE_URL}/flows/${flowId}`, { method: 'DELETE' }, auth);
};

