import { useState, useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Affiche le splash screen pendant 3 secondes

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <img 
          src="/ua.png" 
          alt="UA Logo" 
          className="splash-logo"
        />
        <p className="splash-text">
          Réalisé par Digit Group integrteur de solutions digitales
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;

