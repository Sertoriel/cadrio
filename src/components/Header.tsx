import React from 'react';
// import { Calendar } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="bg-white border-b-4 border-blue-600 shadow-lg">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-left justify-left gap-10 ">
          <div className="bg-white rounded-full p-2">
            <a
              href="https://www.1746.rio/hc/pt-br"
              target="_blank"
              rel="noopener noreferrer"
              className=""
            >
              <img
                src="https://res.cloudinary.com/defn9u2t7/image/upload/v1754450405/cad1_kfbpxy.jpg"
                alt="Central 1746"
                className="h-32 object-contain filter brightness-110 transition-transform hover:scale-105"
              />
            </a>
          </div>
          <div className="bg-white rounded-full p-2">
            <a
              href="https://cadunico.rio/#"
              target="_blank"
              rel="noopener noreferrer"
              className=""
            >
              <img
                src="https://cadunico.rio/img/logo-cad-rio.png"
                alt="Cad Rio Logo"
                className="h-32 object-contain filter brightness-110 transition-transform hover:scale-105"
              />
            </a>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;