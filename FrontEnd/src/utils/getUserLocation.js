// utils/getUserLocation.js
export async function getUserLocation() {
  if (!navigator.geolocation) {
    throw new Error("Geolocation not supported");
  }

  return new Promise((resolve, reject) => {
    let bestAccuracy = Infinity;
    let resolved = false;

    const success = (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;

      // Log the location immediately
    

      if (accuracy < bestAccuracy) {
        bestAccuracy = accuracy;
        if (!resolved) {
          resolved = true;
          resolve({ latitude, longitude, accuracy });
        }
      }
    };

    const fail = (err) => {
      if (!resolved) reject(err);
    };

    // Fast attempt (desktop-friendly)
    navigator.geolocation.getCurrentPosition(success, fail, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    });

    // GPS attempt (mobile)
    navigator.geolocation.getCurrentPosition(success, () => {}, {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0,
    });
  });
}
