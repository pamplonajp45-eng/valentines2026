import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [showInvitation, setShowInvitation] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputName, setInputName] = useState("");
  const [response, setResponse] = useState(null);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [noButtonSize, setNoButtonSize] = useState(1);

  // --- AUTH CONFIGURATION ---
  const TARGET_NAME = "MARY GRACE D. AMUTAN"; // Placeholder - PLEASE REPLACE WITH THE ACTUAL NAME
  // ---------------------------

  // Media Refs and Paths
  const bgMusicRef = useRef(null);

  // --- MEDIA SLOTS (Update these paths later) ---
  const AUDIO_PATH = "/image_songs/celebration2.mp3";
  const RIDE_IMAGE_PATH = "/image_songs/image.jpg";
  const SFX_YES_PATH = "/image_songs/celebration.mp3"; // Using shorter version for SFX if available, or stay as is
  const SFX_NO_PATH = "/image_songs/sfx-no.mp3";

  const RIDE_DETAILS = {
    destination: "A Romantic Trip to the Mountains! 🏔️",
    dateTime: "February 14, 2026 • 09:00 AM"
  };
  // ----------------------------------------------

  const playSFX = (path) => {
    const audio = new Audio(path);
    audio.play().catch(e => {
      console.warn(`SFX play failed for ${path}:`, e.message);
    });
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (inputName.trim().toUpperCase() === TARGET_NAME.toUpperCase()) {
      setIsAuthenticated(true);
      // Optional: Start music on auth if possible
      if (bgMusicRef.current) {
        bgMusicRef.current.volume = 0.4;
        bgMusicRef.current.play().catch(() => { });
      }
    } else {
      alert("Oops! That's not the name I'm looking for. ");
    }
  };

  const handleOpenEnvelope = () => {
    setIsOpening(true);
    // Start background music on interaction
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.4;
      bgMusicRef.current.play().catch(e => {
        console.warn("Background music blocked or not found:", e.message);
      });
    }
    // Waiting for the flaps to open
    setTimeout(() => {
      setShowInvitation(true);
    }, 1200); // Animation duration
  };

  const handleYes = async () => {
    playSFX(SFX_YES_PATH);
    try {
      const res = await fetch("/api/send-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accepted: true }),
      });

      if (!res.ok) throw new Error("API not available");

      const data = await res.json();
      setResponse(data.message);
    } catch (error) {
      console.warn("API Error:", error.message, "- Falling back to local response.");
      // Fallback message for static deployment or missing backend
      setResponse("Yowwn! Lezgooow! 💕");
    }
  };

  const handleNoAction = (e) => {
    // Prevent default to stop multi-triggering on touch/click
    if (e) e.preventDefault();

    playSFX(SFX_NO_PATH);

    // Wider and more dynamic range for dodging
    const range = window.innerWidth < 500 ? 150 : 250;
    const randomX = (Math.random() - 0.5) * range;
    const randomY = (Math.random() - 0.5) * range;

    setNoButtonPosition({ x: randomX, y: randomY });
    setNoButtonSize((prev) => Math.min(prev + 0.1, 2.5));
  };

  return (
    <div className="app">
      {/* Background Audio Slot */}
      <audio ref={bgMusicRef} src={AUDIO_PATH} loop />

      {!isAuthenticated ? (
        <div className="auth-container glass">
          <h1>Who is accessing this? 💖</h1>
          <p>FORMAT [FNAME MIDDLEINITIAL(W/.) LNAME]</p>
          <form onSubmit={handleAuth}>
            <input
              type="text"
              placeholder="Enter your full name..."
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="auth-input"
            />
            <button type="submit" className="auth-button">
              Unlock My Heart ✨
            </button>
          </form>
        </div>
      ) : !showInvitation ? (
        <div className={`envelope-container ${isOpening ? 'fade-out' : ''}`}>
          <div
            className={`envelope ${isOpening ? 'is-opening' : ''}`}
            onClick={handleOpenEnvelope}
          >
            <div className="flap-container">
              <div className="flap-outline">
                <span className="tap-instruction">Tap to Open 💌</span>
              </div>
            </div>
            <div className="body">
              <div className={`message-content ${isOpening ? 'is-visible' : ''}`}>
                <p>For You, My Love 💌</p>
                <div className="seal">❤️</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="invitation-card glass">
          {!response ? (
            <>
              <h1>💕Valentine's Day Invitation💕</h1>
              <p className="message">Will you be my Valentine? 🌹</p>
              <div className="buttons-container">
                <button
                  className="yes-button"
                  style={{ transform: `scale(${noButtonSize})` }}
                  onClick={handleYes}
                >
                  Yes!, Sure. 💖
                </button>
                <button
                  className="no-button"
                  style={{
                    transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`,
                    transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                  onMouseEnter={handleNoAction}
                  onTouchStart={handleNoAction}
                  onClick={(e) => e.preventDefault()}
                >
                  Utot mo!
                </button>
              </div>
            </>
          ) : (
            <div className="response">
              <h1>{response}</h1>

              <div className="ride-details-container glass">
                <div className="ride-photo">
                  <img src={RIDE_IMAGE_PATH} alt="Our Adventure" onError={(e) => e.target.src = "https://via.placeholder.com/800x450?text=Upload+Your+Ride+Photo+Here"} />
                </div>
                <div className="ride-info">
                  <h2 className="destination">{RIDE_DETAILS.destination}</h2>
                  <div className="timing">
                    <span className="icon">📅</span>
                    <p>{RIDE_DETAILS.dateTime}</p>
                  </div>

                  <div className="map-container">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3866.0804059265975!2d121.48009979999999!3d14.3067608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397fb001162cf59%3A0xc6e7dcc1480cb7da!2sCaliraya%20Skypod!5e0!3m2!1sen!2sph!4v1770524221443!5m2!1sen!2sph"
                      width="100%"
                      height="250"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Ride Destination Map"
                    ></iframe>
                  </div>
                </div>
              </div>

              <div className="hearts">
                <span>❤️</span>
                <span>💕</span>
                <span>💖</span>
                <span>💗</span>
                <span>💝</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}



export default App;

