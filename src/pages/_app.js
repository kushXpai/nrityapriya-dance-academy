// pages/_app.js
import '../app/globals.css'  // Adjust path as needed

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}