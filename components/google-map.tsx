'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import styles from './google-map.module.css';
import { ProfessionalCard } from './professional-card';
import { GM_STYLES } from './map.styles';

export const GM_ICON_PATH =
  'M 24 0 C 37.254833995939045 0 48 10.74516600406095 48 23.999999999999993 C 48 37.25483399593904 37.25483399593905 47.99999999999999 24.000000000000007 48 C 10.745166004060964 48.00000000000001 3.552713678800501e-15 37.25483399593905 0 24.000000000000007 C 0 10.745166004060957 10.745166004060957 0 24 0 Z';

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  showMarker?: boolean;
  professionalsProp?: any[];
  showCard?: boolean;
  profession: string;
}

export function GoogleMap({
  center: centerProp,
  zoom = 14,
  showMarker = false,
  professionalsProp = [],
  showCard = false,
  profession = ''
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const extraMarkersRef = useRef<google.maps.Marker[]>([]);
  const selectedMarkerRef = useRef<google.maps.Marker | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const isInitialized = useRef(false);

  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [showCardProp, setShowCardProp] = useState(false);
  const [professional, setProfessional] = useState<any>(null);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [professionals, setProfessionals] = useState<any[]>(professionalsProp);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number }[]>([]);
  const newMarkers: google.maps.Marker[] = [];

  const clearExtraMarkers = () => {
    extraMarkersRef.current.forEach((m) => m.setMap(null));
    extraMarkersRef.current = [];
  };

  useEffect(() => {
    if (!centerProp) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCenter({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => console.error('Error getting location:', error)
        );
      }
    } else {
      setCenter(centerProp);
    }
    setShowCardProp(showCard);
  }, [centerProp, showCard]);

  useEffect(() => {
    if (!profession) {
      console.log('Marcadores extra:', extraMarkersRef.current);
      clearExtraMarkers();

      directionsRendererRef.current?.setMap(null);
      directionsRendererRef.current = null;
      setProfessional(null);
      setSelectedIndex(null);
      setSelectedProfession('');
      setShowCardProp(false);
      setProfessionals([]);
      setProfessionals(professionalsProp);
      console.log(professionalsProp);

      return;
    }

    if (center && professionalsProp.length > 0 && showCard && profession) {
      const { prof, index } = selectRandomProfessional();
      const generatedCoords = generateNearbyCoords(center, professionalsProp.length);
      setCoords(generatedCoords);
      setProfessional(prof);
      setSelectedIndex(index);
      setShowCardProp(true);
      setSelectedProfession(profession);
      setProfessionals([]);
      setProfessionals(professionalsProp);
    }
  }, [center, professionalsProp, showCard, profession]);

  const getInitials = (prof: any) => {
    const { firstName, lastName } = prof;
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const generateNearbyCoords = (base: { lat: number; lng: number }, count = 5, radiusKm = 2) => {
    const coords = [];
    for (let i = 0; i < count; i++) {
      const r = radiusKm / 111.32;
      const u = Math.random();
      const v = Math.random();
      const w = r * Math.sqrt(u);
      const t = 2 * Math.PI * v;
      const dx = w * Math.cos(t);
      const dy = w * Math.sin(t);
      const lat = base.lat + dy;
      const lng = base.lng + dx / Math.cos(base.lat * (Math.PI / 180));
      coords.push({ lat, lng });
    }
    return coords;
  };

  const selectRandomProfessional = () => {
    const index = Math.floor(Math.random() * professionals.length);
    return { prof: professionals[index], index };
  };

  const addProfessionalMarkers = useCallback(async () => {
    if (!mapInstanceRef.current || !center) return;
    extraMarkersRef.current.forEach((m) => m.setMap(null));
    extraMarkersRef.current = [];

    const { Marker } = await window.google.maps.importLibrary('marker');

    extraMarkersRef.current.forEach((m) => m.setMap(null));
    extraMarkersRef.current = [];

    professionals.forEach((prof, index) => {
      const coord = coords[index];
      const isSelected = index === selectedIndex;

      const marker = new Marker({
        position: coord,
        map: mapInstanceRef.current!,
        title: `${prof.firstName} ${prof.lastName}`,
        label: {
          text: getInitials(prof),
          color: isSelected ? '#facc15' : 'white',
          fontSize: '14px',
          fontWeight: '800'
        },
        icon: {
          path: GM_ICON_PATH,
          fillColor: isSelected ? 'white' : 'black',
          fillOpacity: 1,
          scale: 0.8,
          strokeWeight: 0,
          labelOrigin: new window.google.maps.Point(25, 25)
        }
      });
      newMarkers.push(marker);

      if (isSelected) {
        selectedMarkerRef.current = marker;
        drawRouteToProfessional(coord);
      }

      marker.addListener('click', () => {
        /*   setProfessional(prof);
        setSelectedIndex(index);
        setShowCardProp(true); */
      });
    });
    extraMarkersRef.current = newMarkers;
  }, [mapInstanceRef.current, center, professionals, selectedIndex]);

  const drawRouteToProfessional = async (destination: { lat: number; lng: number }) => {
    if (!window.google?.maps || !center || !mapInstanceRef.current) return;
    const { DirectionsService, DirectionsRenderer } = await window.google.maps.importLibrary('routes');

    const directionsService = new DirectionsService();
    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new DirectionsRenderer({ suppressMarkers: true });
      directionsRendererRef.current.setMap(mapInstanceRef.current);
    }

    directionsService.route(
      {
        origin: center,
        destination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === 'OK' && result) {
          directionsRendererRef.current?.setOptions({
            polylineOptions: {
              strokeColor: 'black',
              strokeOpacity: 0.8,
              strokeWeight: 8
            }
          });
          directionsRendererRef.current?.setDirections(result);
        } else {
          console.error('Directions request failed:', status);
        }
      }
    );
  };

  const initMap = async () => {
    if (!mapRef.current || !center || !window.google?.maps) return;
    const { Map } = await window.google.maps.importLibrary('maps');
    const map = new Map(mapRef.current, {
      center,
      zoom,
      mapId: 'CHANCES_MAP',
      disableDefaultUI: false,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      zoomControl: false,
      clickableIcons: false,
      cameraControl: false,
      styles: GM_STYLES
    });
    mapInstanceRef.current = map;
    isInitialized.current = true;
  };

  const createOrUpdateUserMarker = async () => {
    if (!mapInstanceRef.current || !center) return;
    const { Marker } = await window.google.maps.importLibrary('marker');

    if (!userMarkerRef.current) {
      userMarkerRef.current = new Marker({
        position: center,
        map: mapInstanceRef.current,
        title: 'Tu ubicación',
        icon: {
          url: '/map_marker.png',
          scaledSize: new window.google.maps.Size(50, 50),
          origin: new window.google.maps.Point(0, 0)
        }
      });
    } else {
      userMarkerRef.current.setPosition(center);
    }
  };

  useEffect(() => {
    const checkLoaded = () => {
      if (window.google?.maps) {
        setIsGoogleLoaded(true);
        return true;
      }
      return false;
    };

    if (checkLoaded()) return;

    const interval = setInterval(() => {
      if (checkLoaded()) clearInterval(interval);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isGoogleLoaded || !center || isInitialized.current) return;
    initMap();
  }, [isGoogleLoaded, center]);

  useEffect(() => {
    if (!center || !isGoogleLoaded || !mapInstanceRef.current) return;

    mapInstanceRef.current.setCenter(center);

    const update = async () => {
      if (showMarker) await createOrUpdateUserMarker();
      if (professionals.length > 0 && coords.length === professionals.length) {
        await addProfessionalMarkers();
      }
    };
    update();
  }, [center, isGoogleLoaded, showMarker, professionals, selectedIndex]);

  useEffect(() => {
    return () => {
      userMarkerRef.current?.setMap(null);
      extraMarkersRef.current.forEach((m) => m.setMap(null));
      directionsRendererRef.current?.setMap(null);
    };
  }, []);

  const handleContinueAPP = () => {
    console.log('Continuar desde la APP');
    window.open('https://chances.com.ar/links/', '_blank');
    setShowModal(false);
  };

  const handleContinueWEB = () => {
    console.log('Continuar desde la WEB');
    window.open('https://app.chances.com.ar/', '_blank');
    setShowModal(false);
  };

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />

      {!isGoogleLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {showCardProp && professional && (
        <div className={styles.card}>
          <ProfessionalCard professional={professional} isSelected={true} onClick={() => setShowModal(true)} />
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-5 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-bold mb-4">¿Como deseas continuar?</h2>
            <div className="flex justify-end gap-4">
              <button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={handleContinueAPP}>
                Desde la APP
              </button>
              <button
                className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
                onClick={handleContinueWEB}>
                Desde la WEB
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
