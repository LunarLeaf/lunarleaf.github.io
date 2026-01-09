// Enhanced Hologram Effect with High Sensitivity
// Reacts to minimal phone movements
(function () {
  console.log("orzel.js loaded - Ultra Sensitive Version");

  // Configuration
  const CONFIG = {
    transitionSpeed: '0.30s',      // Very fast transitions
    baseOpacity: 0.2,              // Always visible
    maxOpacity: 0.95,              // Maximum intensity
    movementAmplifier: 1.4,        // Boost small movements
    useSmoothing: false,           // Disable smoothing for instant response
    deadZone: 0.10,                // Ignore very tiny movements
    useVelocity: true,             // Respond to speed of movement
    microVibration: true           // Add subtle constant animation
  };

  // State variables
  let lastBeta = 0;
  let lastGamma = 0;
  let lastTime = Date.now();
  let velocity = 0;
  let timeOffset = 0;

  // Initialize hologram
  function initHologram() {
    const holos = document.querySelectorAll(".holo-back");
    const bases = document.querySelectorAll(".base-back");
    const tops = document.querySelectorAll(".godlo-top");

    console.log(
      `initHologram: found ${holos.length} holo-back, ${bases.length} base-back, ${tops.length} godlo-top`
    );

    if (holos.length === 0) {
      console.warn("No .holo-back elements found!");
      return;
    }

    // Force background images to load
    bases.forEach((base) => {
      base.style.display = "block";
      base.style.opacity = "1";
    });

    tops.forEach((top) => {
      top.style.display = "block";
      top.style.opacity = "1";
    });

    // Set initial state with fast transitions
    holos.forEach((holo) => {
      holo.style.opacity = CONFIG.baseOpacity.toString();
      holo.style.backgroundPosition = "center 50%";
      holo.style.transition = `all ${CONFIG.transitionSpeed} ease-out`;
      holo.style.willChange = "opacity, background-position"; // Optimize for animation
    });

    console.log("Ultra-sensitive hologram initialized");
  }

  // Ultra-sensitive orientation handler
  function handleUltraSensitiveOrientation(e) {
    if (e.beta === null || e.gamma === null) return;

    const currentTime = Date.now();
    const deltaTime = Math.max(1, currentTime - lastTime);
    lastTime = currentTime;

    // Calculate velocity (speed of movement)
    if (CONFIG.useVelocity) {
      const deltaBeta = Math.abs(e.beta - lastBeta);
      velocity = deltaBeta / (deltaTime / 1000); // degrees per second
    }

    // Update last values
    lastBeta = e.beta;
    lastGamma = e.gamma;

    const holos = document.querySelectorAll(".holo-back");
    if (holos.length === 0) return;

    // Get normalized values (-1 to 1 range)
    const betaNormalized = (e.beta % 360) / 180; // Normalize to -2 to 2, then clamp
    const gammaNormalized = (e.gamma % 180) / 90;
    
    // Combine axes for 2D sensitivity
    const combinedMovement = Math.sqrt(
      betaNormalized * betaNormalized + 
      gammaNormalized * gammaNormalized
    );

    // Apply dead zone (ignore tiny movements)
    let movementIntensity = combinedMovement < CONFIG.deadZone 
      ? 0 
      : (combinedMovement - CONFIG.deadZone) / (1 - CONFIG.deadZone);

    // Amplify small movements exponentially
    movementIntensity = Math.pow(movementIntensity, 0.4) * CONFIG.movementAmplifier;

    // Add velocity boost for fast movements
    if (CONFIG.useVelocity) {
      const velocityBoost = Math.min(velocity / 100, 0.5); // Cap at 50% boost
      movementIntensity = Math.min(1, movementIntensity + velocityBoost);
    }

    // Add micro-vibration for constant subtle movement
    if (CONFIG.microVibration) {
      timeOffset += deltaTime / 1000;
      const microVibe = Math.sin(timeOffset * 8) * 0.08;
      movementIntensity = Math.max(0, Math.min(1, movementIntensity + microVibe));
    }

    // Calculate final values
    const opacity = CONFIG.baseOpacity + 
                   (movementIntensity * (CONFIG.maxOpacity - CONFIG.baseOpacity));
    
    const position = 50 + (movementIntensity * 100) - 50;

    // Apply to all holograms
    holos.forEach((holo) => {
      // Use transform for smoother animations if supported
      if (holo.style.transform !== undefined) {
        holo.style.transform = `translateY(${position - 50}px)`;
      }
      
      holo.style.backgroundPosition = `center ${position}%`;
      holo.style.opacity = opacity.toString();
      
      // Dynamic transition based on movement speed
      const dynamicSpeed = CONFIG.useVelocity 
        ? `${0.03 + (velocity / 1000)}s` 
        : CONFIG.transitionSpeed;
      holo.style.transition = `all ${dynamicSpeed} ease-out`;
    });
  }

  // Simplified version for maximum responsiveness (no smoothing)
  function handleInstantOrientation(e) {
    if (e.beta === null) return;

    const holos = document.querySelectorAll(".holo-back");
    if (holos.length === 0) return;

    // Direct mapping with no smoothing - fastest response
    const angle = e.beta;
    
    // Convert angle to intensity (0 to 1)
    let intensity = Math.abs(Math.sin(angle * Math.PI / 180));
    
    // Square root for more sensitivity in lower ranges
    intensity = Math.sqrt(intensity);
    
    // Apply immediate response
    const opacity = 0.15 + (intensity * 0.8);
    const position = intensity * 100;

    holos.forEach((holo) => {
      // No transition for instant response
      holo.style.transition = 'none';
      holo.style.backgroundPosition = `center ${position}%`;
      holo.style.opacity = opacity.toString();
      
      // Re-enable transition after update for next frame
      requestAnimationFrame(() => {
        holo.style.transition = `all ${CONFIG.transitionSpeed} ease-out`;
      });
    });
  }

  // Enable motion sensors
  function enableMotionSensor() {
    console.log("[Orzel] Attaching ultra-sensitive orientation listener");
    
    // Check for device orientation support
    if (window.DeviceOrientationEvent) {
      // Use instant response handler for maximum sensitivity
      window.addEventListener("deviceorientation", handleInstantOrientation);
      
      // Add devicemotion for acceleration data
      window.addEventListener('devicemotion', (e) => {
        if (e.acceleration && holos.length > 0) {
          const accel = Math.sqrt(
            Math.pow(e.acceleration.x || 0, 2) +
            Math.pow(e.acceleration.y || 0, 2) +
            Math.pow(e.acceleration.z || 0, 2)
          );
          
          // Quick flash on sudden acceleration
          if (accel > 2) {
            const holos = document.querySelectorAll('.holo-back');
            holos.forEach(holo => {
              const originalOpacity = holo.style.opacity;
              holo.style.opacity = '1';
              setTimeout(() => {
                holo.style.opacity = originalOpacity;
              }, 50);
            });
          }
        }
      });
      
      // Log sensor data for debugging
      window.addEventListener("deviceorientation", (e) => {
        console.debug(`Orientation: beta=${e.beta?.toFixed(1)}, gamma=${e.gamma?.toFixed(1)}, alpha=${e.alpha?.toFixed(1)}`);
      }, { once: true });
      
    } else {
      console.warn("[Orzel] DeviceOrientation not supported");
      
      // Fallback: Add mouse movement detection for desktop
      document.addEventListener('mousemove', (e) => {
        const holos = document.querySelectorAll('.holo-back');
        if (holos.length === 0) return;
        
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        const intensity = (x + y) / 2;
        
        const opacity = 0.2 + (intensity * 0.7);
        const position = intensity * 100;
        
        holos.forEach(holo => {
          holo.style.backgroundPosition = `center ${position}%`;
          holo.style.opacity = opacity.toString();
        });
      });
    }
  }

  // Initialize everything
  initHologram();
  
  // Re-initialize on page show (for cached pages)
  window.addEventListener("pageshow", function (event) {
    console.log("pageshow event, persisted:", event.persisted);
    if (event.persisted) {
      initHologram();
    }
  });
  
  // Start motion detection
  setTimeout(() => {
    enableMotionSensor();
  }, 100); // Small delay to ensure DOM is ready

  // Test function - makes hologram "breathe" for visual confirmation
  function testHologram() {
    const holos = document.querySelectorAll('.holo-back');
    if (holos.length === 0) return;
    
    console.log("Testing hologram sensitivity...");
    
    let phase = 0;
    const testInterval = setInterval(() => {
      phase += 0.1;
      const intensity = (Math.sin(phase) + 1) / 2;
      
      holos.forEach(holo => {
        holo.style.backgroundPosition = `center ${intensity * 100}%`;
        holo.style.opacity = (0.3 + intensity * 0.6).toString();
      });
      
      if (phase > Math.PI * 2) {
        clearInterval(testInterval);
        // Return to normal
        setTimeout(() => {
          holos.forEach(holo => {
            holo.style.backgroundPosition = "center 50%";
            holo.style.opacity = CONFIG.baseOpacity.toString();
          });
        }, 300);
      }
    }, 50);
  }

  // Expose test function globally for debugging
  window.testHologram = testHologram;

  // Optional: Auto-test on load (comment out if not needed)
  // setTimeout(testHologram, 1000);

})();