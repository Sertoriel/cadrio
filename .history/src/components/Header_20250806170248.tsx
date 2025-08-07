import React from 'react';
import { Calendar } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="bg-white border-b-4 border-blue-600 shadow-lg">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-12">
          <a 
            href="https://www.1746.rio/hc/pt-br" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105"
          >
            <img 
              src="https://res.cloudinary.com/defn9u2t7/image/upload/v1754450405/cad1_kfbpxy.jpg" 
              alt="Central 1746" 
              className="h-20 object-contain filter brightness-110"
            />
          </a>
          
<div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl p-6 shadow-xl">
  <img 
    src="https://res.cloudinary.com/defn9u2t7/image/upload/v1754450404/logo-cad-rio_euabnn.png" 
    alt="Logo CADRio" 
    className="h-16 mx-auto" // Ajuste a altura (h-16) conforme necessário
  />
</div>
        </div>
      </header>
    </div>
  );
};

export default Header;