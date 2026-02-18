import React, { useEffect, useMemo, useState } from 'react'

const CountdownTimer = ({ expiryDate, expiresAt, className = "de_countdown" }) => {
    const targetMs = useMemo (() => {
        if (typeof expiresAt ==="number" && Number.isFinite(expiresAt)) return expiresAt;
    
        if (expiryDate) {
            const d = new Date(expiryDate);
            const ms = d.getTime();
            if (Number.isFinite(ms)) return ms;
        }
    
    return null;
    }, [expiryDate, expiresAt]);

    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        if (!targetMs) return;
        const id = setInterval(() => setNow(Date.now()),1000);
        return () => clearInterval(id);
    }, [targetMs]);

    if (!targetMs) return null;
    const diff = Math.max(0, targetMs - now);
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return(
        <div className={className}>
            {hours}h {minutes}m {seconds}s 
            </div>
    );
    
  
};

export default CountdownTimer;