// Closed fist gesture for pause
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import React, { useRef, useEffect } from "react";
import * as handpose from "@tensorflow-models/handpose";
// @ts-ignore
import * as fp from "fingerpose";
import { usePlayer } from "../context/PlayerContext";

// Gesture Definitions
const OpenPalmGesture = new fp.GestureDescription("open_palm");
for (let finger of [fp.Finger.Thumb, fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
  OpenPalmGesture.addCurl(finger, fp.FingerCurl.NoCurl, 1.0);
}

const PointRightGesture = new fp.GestureDescription("point_right");
PointRightGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
for (let finger of [fp.Finger.Thumb, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
  PointRightGesture.addCurl(finger, fp.FingerCurl.FullCurl, 0.8);
}
const PeaceGesture = new fp.GestureDescription("peace");
PeaceGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
PeaceGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
PeaceGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 0.9);
PeaceGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
PeaceGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);

const FistGesture = new fp.GestureDescription("fist");
FistGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);
FistGesture.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 1.0);
FistGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
FistGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
FistGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);

const GestureController: React.FC<{ trackUris: string[] }> = ({ trackUris }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modelRef = useRef<any>(null);
  const { isPlaying, setIsPlaying, currentTrackUris, setCurrentTrackUris } = usePlayer();
  const trackIndexRef = useRef(0);

  // Start webcam and load model
  useEffect(() => {
    async function setup() {
      const net = await handpose.load();
      modelRef.current = net;
      if (navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      }
    }
    setup();
  }, []);

  // Gesture detection loop
  useEffect(() => {
    if (!modelRef.current) return;
    const GE = new fp.GestureEstimator([
      OpenPalmGesture,
      FistGesture,
      PointRightGesture,
      PeaceGesture
    ]);
    let lastGesture = "";
    let lastGestureTime = 0;
    const COOLDOWN = 1500; // 1.5 second cooldown
    
    const detect = async () => {
      // Check if video element exists and has enough data to process (readyState 4 = HAVE_ENOUGH_DATA)
      if (videoRef.current && videoRef.current.readyState === 4) {
        // Use the handpose model to detect hands in the current video frame
        // Returns an array of detected hands with their landmark coordinates
        const hand = await modelRef.current.estimateHands(videoRef.current);
        
        // Process only if at least one hand is detected
        if (hand.length > 0) {
          // Estimate gestures based on the first hand's landmarks
          // hand[0].landmarks contains 21 3D points representing the hand skeleton
          // 6.5 is the confidence threshold - gestures below this confidence are ignored
          const est = await GE.estimate(hand[0].landmarks, 6.5);
          
          // Check if any gestures were recognized with sufficient confidence
          if (est.gestures && est.gestures.length > 0) {
            // Find the gesture with the highest confidence score
            // This reduces multiple detected gestures to the most likely one
            const result = est.gestures.reduce((p: any, c: any) => (p.confidence > c.confidence ? p : c));
            const now = Date.now();
            
            // Only trigger if gesture changed OR enough time has passed for same gesture
            if (result.name !== lastGesture || (result.name === lastGesture && now - lastGestureTime > COOLDOWN)) {
              lastGesture = result.name;
              lastGestureTime = now;
              handleGesture(result.name);
            }
          }
        } else {
          // Clear last gesture when no hand is detected
          if (Date.now() - lastGestureTime > 500) { // Small delay before clearing
            lastGesture = "";
          }
        }
      }
    };
    const interval = setInterval(detect, 400);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [trackUris, isPlaying]);

  // Gesture handler
  const handleGesture = (name: string) => {
    console.log(`🎵 Gesture detected: ${name}`);
    console.log(`Current playing state: ${isPlaying}`);
    console.log(`Current track URIs length: ${currentTrackUris.length}`);
    
    if (name === "open_palm") {
      console.log("▶️ Open palm gesture detected - Playing");
      setIsPlaying(true);
    } else if (name === "fist") {
      console.log("⏸️ Fist gesture detected - Pausing");
      setIsPlaying(false);
    } else if (name === "point_right") {
      console.log("⏭️ Next track gesture detected");
      // Next track
      trackIndexRef.current = (trackIndexRef.current + 1) % trackUris.length;
      setCurrentTrackUris([trackUris[trackIndexRef.current]]);
      setIsPlaying(true);
    } else if (name === "peace") {
      console.log("⏮️ Previous track gesture detected");
      // Previous track
      trackIndexRef.current = (trackIndexRef.current - 1 + trackUris.length) % trackUris.length;
      setCurrentTrackUris([trackUris[trackIndexRef.current]]);
      setIsPlaying(true);
    }
  };

  return (
    <div style={{ position: "fixed", right: 20, bottom: 100, zIndex: 100 }}>
      <video ref={videoRef} autoPlay playsInline muted width={240} height={180} style={{ borderRadius: 8, boxShadow: "0 2px 8px #0006" }} />
      <div style={{ fontSize: 12, color: "#fff", background: "#111a", padding: 4, borderRadius: 4, marginTop: 4 }}>Gesture Control Active</div>
    </div>
  );
};

export default GestureController;
