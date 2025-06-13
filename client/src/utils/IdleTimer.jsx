import React, { useEffect, useRef } from "react";

const IdleTimer = ({ timeout, onIdle }) => {
  const timerRef = useRef(null);

  useEffect(() => {
    const startIdleTimer = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onIdle(); // Trigger logout after idle timeout
      }, timeout);
    };

    const handleUserActivity = () => {
      startIdleTimer();
    };

    // Start the timer initially
    startIdleTimer();

    // Events to listen to
    const events = ["mousemove", "keydown", "touchstart", "touchmove", "scroll"];

    // Attach all events
    events.forEach(event =>
      window.addEventListener(event, handleUserActivity)
    );

    // Cleanup
    return () => {
      clearTimeout(timerRef.current);
      events.forEach(event =>
        window.removeEventListener(event, handleUserActivity)
      );
    };
  }, [timeout, onIdle]);

  return null;
};

export default IdleTimer;