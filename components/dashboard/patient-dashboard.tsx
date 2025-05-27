"use client"

import { useAuth } from "@/lib/auth-context"

const PatientDashboard = () => {
  const { user, signOut } = useAuth()

  return (
    <div>
      <h1>Patient Dashboard</h1>
      {user ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <p>Please sign in.</p>
      )}
    </div>
  )
}

export default PatientDashboard
