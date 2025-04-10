'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Profession {
  id: string;
  name: string;
}

interface SearchFormProps {
  onAddressSelected: (address: string, location: { lat: number; lng: number }, profession: string) => void;
}

export function SearchForm({ onAddressSelected }: SearchFormProps) {
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfession, setSelectedProfession] = useState<Profession | null>(null);
  const [open, setOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userAddress, setUserAddress] = useState('');
  const [radioValue, setRadioValue] = useState(10);
  useEffect(() => {
    const fallbackLocation = { lat: -34.6038092, lng: -58.3821173 };

    if (!navigator.geolocation) {
      setUserLocation(fallbackLocation);
      setUserAddress('Ubicación por defecto');
      onAddressSelected('Ubicación por defecto', fallbackLocation, '');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ location }, (results, status) => {
          const address = status === 'OK' && results && results[0] ? results[0].formatted_address : 'Ubicación actual';

          setUserAddress(address);
          setUserLocation(location);
          onAddressSelected(address, location, '');
        });
      },
      (error) => {
        console.warn('No se pudo obtener la ubicación. Usando ubicación por defecto.', error);
        setUserLocation(fallbackLocation);
        setUserAddress('Ubicación por defecto');
        onAddressSelected('Ubicación por defecto', fallbackLocation, '');
      }
    );
  }, [onAddressSelected]);

  useEffect(() => {
    const fetchProfessions = async () => {
      setLoading(true);
      const fallbackProfessions = [
        { id: '1', name: 'Plomero' },
        { id: '2', name: 'Electricista' },
        { id: '3', name: 'Médico' },
        { id: '4', name: 'Abogado' },
        { id: '5', name: 'Profesor' },
        { id: '6', name: 'Diseñador' },
        { id: '7', name: 'Desarrollador' },
        { id: '8', name: 'Contador' },
        { id: '9', name: 'Arquitecto' },
        { id: '10', name: 'Técnico en refrigeración' }
      ];

      try {
        const response = await fetch('/api/professions');
        const data = await response.json();
        setProfessions(Array.isArray(data) && data.length ? data : fallbackProfessions);
      } catch {
        setProfessions(fallbackProfessions);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessions();
  }, []);

  const handleSearch = useCallback(() => {
    if (!userLocation) return alert('Ubicación no disponible');
    if (!selectedProfession) return alert('Por favor selecciona una profesión');

    onAddressSelected(userAddress || 'Ubicación actual', userLocation, selectedProfession.id);
  }, [userLocation, selectedProfession, userAddress, onAddressSelected]);

  const handleProfessionSelect = useCallback(
    (profession: Profession) => {
      setSelectedProfession(profession);
      setOpen(false);
    },
    [setSelectedProfession]
  );

  useEffect(() => {
    if (!userLocation || !selectedProfession) return;
    onAddressSelected(userAddress || 'Ubicación actual', userLocation, selectedProfession.id);
  }, [selectedProfession, radioValue, userLocation, userAddress, onAddressSelected]);
  

  return (
    <Card className="w-full max-w-md mt-4 border-none shadow-none bg-white">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/*  <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-5 w-5 text-primary" />
            <span>{userAddress || 'Obteniendo ubicación...'}</span>
          </div> */}

          {/* COMBOBOX PROFESIONES */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  'w-full px-4 py-3 bg-[#f5f5f5] rounded-full text-md text-muted-foreground flex items-center justify-between',
                  'border-none focus:outline-none shadow-none'
                )}>
                <div className="flex items-center gap-2 ">
                  <Search className="h-4 w-4" />
                  {selectedProfession ? selectedProfession.name : '¿A quién necesitas?'}
                </div>
                {selectedProfession && (
                  <X
                    className="w-4 h-4 text-muted-foreground hover:text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProfession(null);
                    }}
                  />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Buscar profesión..." />
                <CommandEmpty>No se encontraron resultados</CommandEmpty>
                <CommandGroup>
                  {loading ? (
                    <div className="p-4 text-sm text-muted-foreground">Cargando profesiones...</div>
                  ) : (
                    professions.map((profession) => (
                      <CommandItem
                        key={profession.id}
                        onSelect={() => {
                          setSelectedProfession(profession);
                          setOpen(false);
                        }}>
                        {profession.name}
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="pt-2">
            <label className="block mb-1 text-sm font-medium text-muted-foreground">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-black">Distancia</div>
                <div className="font-semibold text-black">{radioValue} km</div>
              </div>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={radioValue}
              onChange={(e) => setRadioValue(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer
                  accent-black
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-black
                  [&::-webkit-slider-thumb]:border-none
                  [&::-webkit-slider-thumb]:mt-[-1px]
                  [&::-moz-range-thumb]:h-4
                  [&::-moz-range-thumb]:w-4
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-black
                  [&::-moz-range-thumb]:border-none"
              style={{
                background: `linear-gradient(to right, black 0%, black ${radioValue * 2}%, #d1d5db ${
                  radioValue * 2
                }%, #d1d5db 100%)`
              }}
            />
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
