import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Remove stale localStorage keys left over from an older version of the app
// that used localStorage instead of sessionStorage for form drafts.
['DRUG_FORM_DATA', 'DRUG_FORM_STEP', 'sidebarCollapsed'].forEach(key =>
  localStorage.removeItem(key)
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
