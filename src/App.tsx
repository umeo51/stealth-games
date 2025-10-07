import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import MainContent from './components/MainContent'
import Analytics from './components/Analytics'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Analytics trackingId={process.env.REACT_APP_GA_TRACKING_ID} />
      <Layout>
        <MainContent />
      </Layout>
    </AuthProvider>
  )
}

export default App
