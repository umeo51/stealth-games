import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import MainContent from './components/MainContent'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Layout>
        <MainContent />
      </Layout>
    </AuthProvider>
  )
}

export default App
