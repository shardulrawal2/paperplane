import React, { memo } from 'react';
import Lottie from 'lottie-react';
import paperplaneAnimation from '../assets/animations/paperplane.json';

const BACKGROUND_OPACITY = 0.15;

function BackgroundAnimation() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 overflow-hidden"
      style={{
        pointerEvents: 'none',
        backgroundColor: '#020617',
        zIndex: 0,
      }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: BACKGROUND_OPACITY,
          minWidth: '100%',
          minHeight: '100%',
          pointerEvents: 'none',
        }}
      >
        <Lottie
          animationData={paperplaneAnimation}
          loop
          autoplay
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid slice',
          }}
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '140vw',
            maxHeight: '140vh',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}

export default memo(BackgroundAnimation);
