// utils/locationUtils.ts
export const extractCoordinatesFromLink = (link: string): { latitude: string; longitude: string } | null => {
  if (!link) return null;

  try {
    // تنظيف اللينك من المسافات
    const cleanLink = link.trim();

    // معالجة روابط Google Maps
    if (cleanLink.includes('google.com/maps') || cleanLink.includes('maps.google.com')) {
      // النمط: https://www.google.com/maps/place/.../@31.2001,29.9187
      const coordMatch = cleanLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordMatch) {
        return {
          latitude: coordMatch[1],
          longitude: coordMatch[2]
        };
      }

      // النمط: https://www.google.com/maps?q=31.2001,29.9187
      const qParamMatch = cleanLink.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (qParamMatch) {
        return {
          latitude: qParamMatch[1],
          longitude: qParamMatch[2]
        };
      }

      // النمط: https://www.google.com/maps/search/?api=1&query=31.2001,29.9187
      const queryParamMatch = cleanLink.match(/[?&]query=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (queryParamMatch) {
        return {
          latitude: queryParamMatch[1],
          longitude: queryParamMatch[2]
        };
      }
    }

    // معالجة روابط OpenStreetMap
    if (cleanLink.includes('openstreetmap.org')) {
      const coordMatch = cleanLink.match(/map=(-?\d+\.\d+)\/(-?\d+\.\d+)/);
      if (coordMatch) {
        return {
          latitude: coordMatch[1],
          longitude: coordMatch[2]
        };
      }
    }

    // معالجة إحداثيات مباشرة (31.2001,29.9187)
    const directCoordMatch = cleanLink.match(/^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/);
    if (directCoordMatch) {
      return {
        latitude: directCoordMatch[1],
        longitude: directCoordMatch[2]
      };
    }

    return null;
  } catch (error) {
    console.error('Error extracting coordinates:', error);
    return null;
  }
};

export const isValidLocationLink = (link: string): boolean => {
  return extractCoordinatesFromLink(link) !== null;
};