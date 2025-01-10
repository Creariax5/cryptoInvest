import './App.css'
import PoolSimulator from './PoolSimulator'
import { Alert, AlertDescription } from './components/Alert'
import { AlertCircle } from 'lucide-react'

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

  const poolAddress = getPoolAddress();

  if (!poolAddress) {
    return (
      <div className="w-full min-h-screen p-6">
        <Alert variant="error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please provide a valid pool address in the URL (e.g., /0xcbcdf9626bc03e24f779434178a73a0b4bad62ed)
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <PoolSimulator poolAddress={poolAddress} />
    </div>
  );
}

export default App