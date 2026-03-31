import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.tsx'

const domain = import.meta.env.VITE_AUTH0_DOMAIN || ''
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || ''
const redirectUri = window.location.origin

console.log('Auth0 Config:', { domain, clientId, redirectUri })

const RenderApp = () => {
  if (!domain || !clientId) {
    return (
      <div style={{ padding: 20, color: 'red', fontFamily: 'sans-serif' }}>
        <h1>Missing Auth0 Configuration</h1>
        <p>Could not find VITE_AUTH0_DOMAIN or VITE_AUTH0_CLIENT_ID in the environment variables.</p>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
    >
      <App />
    </Auth0Provider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RenderApp />
  </StrictMode>,
)
