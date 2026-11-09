import './App.css';

import Header from './components/Header';
import Hero from './components/Hero';
import DiagnosticsSection from './components/DiagnosticsSection';
import ExpertiseSection from './components/ExpertiseSection';
import WhyChooseUs from './components/WhyChooseUs';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <DiagnosticsSection />
        <ExpertiseSection />
        <WhyChooseUs/>
        <FinalCTA/>
        <Footer/>
      </main>
    </div>
  );
}

export default App;
