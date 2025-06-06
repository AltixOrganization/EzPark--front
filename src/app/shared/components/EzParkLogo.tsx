import React from 'react';
import { Link } from 'react-router-dom';
import carParkingLogo from '../../../assets/image/ezpark-logo.png'; // Asegúrate de que la ruta sea correcta

interface EzParkLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const EzParkLogo: React.FC<EzParkLogoProps> = ({ 
  className = '', 
  showText = true,
  size = 'medium'
}) => {
  // Determinar el tamaño del logo
  const sizeClass = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-10 w-10'
  }[size];

  // Determinar el tamaño del texto
  const textSizeClass = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  }[size];

  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <img src={carParkingLogo} alt="EzPark Logo" className={sizeClass} />
      {showText && (
        <span className={`ml-2 font-bold ${textSizeClass}`}>
          <span className="text-black">Ez</span>
          <span className="text-blue-600">Park</span>
        </span>
      )}
    </Link>
  );
};

export default EzParkLogo;