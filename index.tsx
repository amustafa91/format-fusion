// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import BlogList from './blog/BlogList';
import GptTokenCounterArticle from './blog/articles/gpt-token-counter';
import JsonToTypescriptArticle from './blog/articles/json-to-typescript';
import ToonFormatGuideArticle from './blog/articles/toon-format-guide';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Inject GTM dynamically
const gtmId = import.meta.env.VITE_GTM_ID;
console.log('GTM ID from env:', gtmId); // Debug log
if (gtmId) {
  const script = document.createElement('script');
  script.async = true;
  script.innerHTML = `
    (function(w,d,s,l,i){
      w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
      f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  `;
  document.head.appendChild(script);
} else {
  console.warn('VITE_GTM_ID environment variable is not set');
}

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/gpt-token-counter" element={<GptTokenCounterArticle />} />
        <Route path="/blog/json-to-typescript" element={<JsonToTypescriptArticle />} />
        <Route path="/blog/toon-format-guide" element={<ToonFormatGuideArticle />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
