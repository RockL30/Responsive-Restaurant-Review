// Loads the Google Maps script
// We use a callback so we are sure that the googlemapscript is loaded 
// console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
export function loadGoogleMapsScript(callback, apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
  // Check if the script is already loaded
  const existingScript = document.getElementById("googleMapsScript");
  if (existingScript && existingScript.dataset.loaded) {
    if (typeof callback === 'function') {
      callback();
    }
    return;
  }

  // Call when the script is loaded
  window.initMap = () => {
    if (existingScript) {
      existingScript.dataset.loaded = true; // Mark script as loaded
    }
    if (typeof callback === 'function') {
      callback();
    }
  };
  // Create a script element if it does not exist
  if (!existingScript) {
    const script = document.createElement("script");
    script.id = "googleMapsScript";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places&callback=initMap`;
    // script.async = true;
    script.defer = true; // ideally we should only have or async or defer
    script.onerror = () => {
      console.error("Google Maps script failed to load.");
    };
    // append the script to the DOM
    document.head.appendChild(script);
  }
}
