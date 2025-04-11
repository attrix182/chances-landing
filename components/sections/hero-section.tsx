'use client';

import { useState, useCallback } from 'react';
import { Star } from 'lucide-react';
import { SearchForm } from '@/components/search-form';
import { GoogleMap } from '@/components/google-map';

const professionals_mock = [
  {
    firstName: 'Ezequiel',
    lastName: 'Robles',
    ranking: 5,
    city: 'Recoleta',
    province: 'Buenos Aires',
    country: 'Argentina',
    image: '/persona-1.jpeg'
  },
  {
    firstName: 'Juan',
    lastName: 'Perez',
    ranking: 5,
    city: 'Recoleta',
    province: 'Buenos Aires',
    country: 'Argentina',
    image: '/persona-2.jpg'
  },
  {
    firstName: 'Maria',
    lastName: 'Gonzalez',
    ranking: 5,
    city: 'Recoleta',
    province: 'Buenos Aires',
    country: 'Argentina',
    image: '/persona-3.png'
  },
  {
    firstName: 'Laura',
    lastName: 'Martinez',
    ranking: 5,
    city: 'Recoleta',
    province: 'Buenos Aires',
    country: 'Argentina',
    image: '/persona-4.png'
  }
  // Puedes duplicar o pasar más
];

export function HeroSection() {
  const [mapCenter, setMapCenter] = useState({ lat: -34.603722, lng: -58.381592 }); // Default to Buenos Aires
  const [showMarker, setShowMarker] = useState(false);
  const [showCard, setShowCard] = useState(false);
   const [professionals, setProfessionals] = useState(professionals_mock);
  const [selectedProfession, setSelectedProfession] = useState('');

  // Memoize the callback to prevent recreating on every render
  const handleAddressSelected = useCallback(
    (address: string, location: { lat: number; lng: number }, profession?: string) => {
      if (location.lat !== mapCenter.lat && location.lng !== mapCenter.lng) {
        setMapCenter(location);
      }
      setShowMarker(true); // Show marker only after an address is selected
      setShowCard(true);
      setProfessionals(professionals_mock);
      setSelectedProfession(profession || '');

      if(!profession){
        setProfessionals([]);
      }
    },
    []
  );

  return (
    <section className="py-12 md:py-24 lg:py-12 xl:py-12">
      <div className="container md:px-6 max-w-full" >
        <div className="grid gap-2 lg:grid-cols-2 items-center">
          {/* Texto + Formulario */}
          <div className="flex flex-col lg:mb-48 items-center lg:items-start text-center lg:text-left justify-center h-full space-y-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl xl:text-4xl/none">
                Si tenés un oficio, tenés una oportunidad
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Encontra un profesional con el oficio que necesitas.
              </p>
            </div>
            <div className="w-full max-w-md">
              <SearchForm onAddressSelected={handleAddressSelected} />
            </div>
          </div>

          {/* Mapa */}
          <div style={{maxHeight: '480px'}} className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] xl:h-[600px] rounded-xl overflow-hidden border shadow-xl">
            <GoogleMap
              center={mapCenter}
              showMarker={true}
              professionalsProp={professionals}
              profession={selectedProfession}
              showCard={showCard}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
