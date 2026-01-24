import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Layout from './components/Layout'
import Pipelines from './pages/Pipelines'
import Projects from './pages/Projects'

function App() {
  const [filterOpen, setFilterOpen] = useState(false)

  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen)
  }

  return (
    <BrowserRouter>
      <Layout onFilterToggle={handleFilterToggle}>
        <Routes>
          <Route path="/" element={<Pipelines filterOpen={filterOpen} setFilterOpen={setFilterOpen} />} />
          <Route path="/projects" element={<Projects filterOpen={filterOpen} setFilterOpen={setFilterOpen} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
