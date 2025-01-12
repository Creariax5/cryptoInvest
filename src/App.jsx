import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import PoolSimulator from './PoolSimulator'
import TopPools from './TopPools'
import { Alert, AlertDescription } from './components/ui/Alert'
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

const PoolRoute = () => {
  const pathname = window.location.pathname;
  const address = pathname.split('/')[1]; // Get the address from the URL

  // Check if it's a valid Ethereum address
  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);

  if (!address) {
    return <Navigate to="/" />;
  }

  if (!isValidAddress) {
    return <NotFound />;
  }

  return <PoolSimulator poolAddress={address} />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TopPools />} />
        <Route path="/:address" element={<PoolRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App