import './App.css'
import PoolSimulator from './PoolSimulator'

function App() {
  return (
    <div className="w-full min-h-screen">
      <PoolSimulator poolAddress="0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640" />
    </div>
  )
}

export default App
