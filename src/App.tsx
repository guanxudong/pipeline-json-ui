import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Pipelines from './pages/Pipelines'
import Projects from './pages/Projects'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Pipelines />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
