import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navigation />
      <main className="pt-16">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
} 