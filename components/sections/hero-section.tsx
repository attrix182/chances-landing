'use client';

import { useState, useCallback } from 'react';
import { Star } from 'lucide-react';
import { SearchForm } from '@/components/search-form';
import { GoogleMap } from '@/components/google-map';

const professionals = [
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
  const [selectedProfession, setSelectedProfession] = useState('');

  // Memoize the callback to prevent recreating on every render
  const handleAddressSelected = useCallback(
    (address: string, location: { lat: number; lng: number }, profession: string) => {
      console.log('Address selected:', address);
      if (location.lat !== mapCenter.lat && location.lng !== mapCenter.lng) {setMapCenter(location)};
      setShowMarker(true); // Show marker only after an address is selected
      if (profession) {
        setShowCard(true);
        setSelectedProfession(profession);
      }
    },
    []
  );

  return (
    <section className="py-12 md:py-24 lg:py-12 xl:py-12">
      <div className="container md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div style={{ height: '450px' }} className="flex flex-col justify-center">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tighter sm:text-2xl xl:text-4xl/none">
              Si tenés un oficio,
              tenés una oportunidad
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Encuentra un profesional con el oficio que necesitas.
              </p>
            </div>
            <SearchForm onAddressSelected={handleAddressSelected} />
 
          </div>
          <div className="mx-auto flex w-full h-[400px] md:h-full items-center justify-center lg:max-w-none rounded-xl overflow-hidden border shadow-xl">
            <GoogleMap
              center={mapCenter} //
              showMarker={true}
              professionals={professionals}
              showCard={showCard}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
