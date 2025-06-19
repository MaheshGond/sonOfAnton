// frontend/src/App.js
import React, { useState, useRef, useCallback, useEffect } from 'react';

// Import Firebase
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';

// Import our refactored pages
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import FlowBuilder from './pages/FlowBuilder';

// Import our API client
import { getFlows, createFlow, updateFlow, deleteFlow, getFlowById } from './api/flows';

function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [firebaseInitError, setFirebaseInitError] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard', 'builder'
  const [currentFlow, setCurrentFlow] = useState(null); // The flow being edited
  const [flows, setFlows] = useState([]);
  const [loadingFlows, setLoadingFlows] = useState(false);

  // Firebase app and services refs
  const app = useRef(null);
  const db = useRef(null); // Firestore is no longer primary storage, but Firebase app still exists
  const auth = useRef(null);

  // Initialize Firebase and set up auth listener
  useEffect(() => {
    // Attempt to parse firebase config
    let firebaseConfig = {};
    try {
      if (typeof __firebase_config !== 'undefined' && __firebase_config) {
        firebaseConfig = JSON.parse(__firebase_config);
      } else {
        throw new Error("Firebase config (__firebase_config) is not defined or is empty.");
      }
    } catch (e) {
      console.error("Error parsing __firebase_config:", e);
      setFirebaseInitError(`Invalid Firebase configuration: ${e.message}`);
      setAuthReady(true); // Allow UI to show error
      return;
    }

    try {
      if (!app.current) { // Only initialize Firebase app once
        app.current = initializeApp(firebaseConfig);
        auth.current = getAuth(app.current);
        // db.current = getFirestore(app.current); // Firestore not used for flows, can remove if not needed for other Firebase features
      }

      const unsubscribeAuth = onAuthStateChanged(auth.current, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          console.log("User logged in:", currentUser.uid);
          // Fetch flows only after user is authenticated and authReady is true
          if (authReady) { // Ensure initial anonymous/custom token sign-in has completed in AuthPage
            // We moved fetchFlows to be triggered once authReady is true AND user exists.
            // This prevents fetching before the initial auth state is settled.
          }
        } else {
          setUser(null);
          setFlows([]); // Clear flows if logged out
          console.log("User logged out or not authenticated.");
        }
        // AuthReady is handled by AuthPage component to ensure it's truly ready for interaction
      });

      return () => unsubscribeAuth();
    } catch (error) {
      console.error("Firebase initialization error:", error);
      setFirebaseInitError(`Firebase initialization failed: ${error.message}`);
      setAuthReady(true); // Allow UI to render with error
    }
  }, [authReady]); // authReady as dependency to ensure its value is current

  // Effect to fetch flows once user is authenticated and authReady is true
  const fetchUserFlows = useCallback(async (userAuth) => {
    if (!userAuth || !authReady) {
      // console.log("Skipping fetch flows: user not ready or auth not ready.");
      return;
    }
    setLoadingFlows(true);
    try {
      // Use the API client to fetch flows from our FastAPI backend
      const fetchedFlows = await getFlows(auth.current);
      setFlows(fetchedFlows || []);
      console.log("Flows loaded from API:", fetchedFlows);
    } catch (error) {
      console.error("Error fetching flows from API:", error);
      // Handle errors: maybe show a message to the user
    } finally {
      setLoadingFlows(false);
    }
  }, [authReady]); // authReady is a dependency

  // Trigger fetchUserFlows when user or authReady state changes
  useEffect(() => {
    if (user && authReady) {
      fetchUserFlows(user);
    }
  }, [user, authReady, fetchUserFlows]);

  const handleSaveFlow = async (flowData) => {
    if (!user || !auth.current) {
      console.error("User not authenticated or auth not ready. Cannot save flow.");
      throw new Error("Authentication required to save flow.");
    }
    try {
      // Check if it's an existing flow (has a flowId) or a new one
      if (currentFlow && currentFlow.flowId) {
        const updated = await updateFlow(flowData.flowId, flowData, auth.current);
        console.log("Flow updated via API:", updated);
      } else {
        const newFlow = await createFlow(flowData, auth.current);
        // After creating, set it as currentFlow so subsequent saves update it
        setCurrentFlow(newFlow);
        console.log("New flow created via API:", newFlow);
      }
      // Re-fetch flows to update the dashboard immediately
      await fetchUserFlows(user);
    } catch (error) {
      console.error("Error saving flow via API:", error);
      throw error; // Re-throw to allow FlowBuilder to show error message
    }
  };

  const handleSelectFlow = async (flow) => {
    // When selecting a flow from the dashboard, fetch its full details from API
    setLoadingFlows(true); // Use loading state for individual flow fetch too
    try {
      const fetchedFlow = await getFlowById(flow.flowId, auth.current);
      setCurrentFlow(fetchedFlow);
      setCurrentPage('builder');
    } catch (error) {
      console.error("Error loading specific flow:", error);
      // Show error to user, maybe return to dashboard
      setCurrentPage('dashboard');
    } finally {
      setLoadingFlows(false);
    }
  };

  const handleCreateNewFlow = () => {
    setCurrentFlow(null); // Clear current flow to start fresh
    setCurrentPage('builder');
  };

  const handleLogout = async () => {
    try {
      if (auth.current) {
        await signOut(auth.current);
        console.log("User logged out.");
      }
      setCurrentPage('dashboard'); // Go back to dashboard, which will redirect to auth page
      setUser(null);
      setFlows([]);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // If there's a Firebase initialization error, display it
  if (firebaseInitError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 p-4">
        <div className="text-red-800 text-center p-6 bg-red-200 rounded-lg shadow-md border border-red-300">
          <h2 className="text-xl font-bold mb-3">Initialization Error</h2>
          <p>{firebaseInitError}</p>
          <p className="mt-2 text-sm">Please check your Firebase configuration (`__firebase_config`).</p>
        </div>
      </div>
    );
  }

  // Show a global loading spinner until Firebase auth state is determined
  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg text-gray-700 font-medium">Loading Anton...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show AuthPage
  if (!user) {
    return <AuthPage setAuthReady={setAuthReady} auth={auth.current} />;
  }

  // Determine the Firebase auth user ID to display
  const firebaseAuthUserId = user.isAnonymous ? `Anonymous User ID: ${user.uid}` : user.email || user.uid;

  // Render appropriate page based on currentPage state
  return (
    <>
      {currentPage === 'dashboard' && (
        <Dashboard
          user={user}
          onSelectFlow={handleSelectFlow}
          onCreateNewFlow={handleCreateNewFlow}
          onLogout={handleLogout}
          flows={flows}
          loadingFlows={loadingFlows}
          firebaseAuthUserId={firebaseAuthUserId}
        />
      )}
      {currentPage === 'builder' && (
        <FlowBuilder
          currentFlow={currentFlow}
          saveFlow={handleSaveFlow}
          user={user}
          onBackToDashboard={() => {
            setCurrentPage('dashboard');
            setCurrentFlow(null); // Clear current flow when going back to dashboard
          }}
        />
      )}
    </>
  );
}

export default App;
