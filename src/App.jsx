import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PoolSimulator from './PoolSimulator'
import { Alert, AlertDescription } from './components/Alert'
import { AlertCircle } from 'lucide-react'

const NotFound = () => (
  <div className="w-full min-h-screen p-6">
    <Alert variant="error">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Page not found. Please check the URL and try again.
      </AlertDescription>
    </Alert>
  </div>
);

function App() {
  // Get pool address from URL pathname or search params
  const getPoolAddress = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const poolFromParams = urlParams.get('pool');
    
    if (poolFromParams) {
      return poolFromParams;
    }
    
    // Remove leading slash and get first path segment
    const pathSegments = window.location.pathname.replace(/^\//, '').split('/');
    const poolFromPath = pathSegments[0];
    
    // Validate pool address format (basic check for ethereum address)
    const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(poolFromPath);
    
    return isValidAddress ? poolFromPath : null;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/:address" 
          element={<PoolSimulator poolAddress={getPoolAddress()} />} 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App