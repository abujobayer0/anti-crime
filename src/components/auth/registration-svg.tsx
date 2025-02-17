import React from "react";

export const RegistrationSvg = () => {
  return (
    <div className="relative w-full h-full">
      <svg
        className="w-full h-full"
        viewBox="0 0 800 600"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Elements */}
        <rect width="800" height="600" fill="hsl(220 33% 98%)" />{" "}
        {/* --background */}
        <circle
          cx="400"
          cy="300"
          r="250"
          fill="hsl(220 47% 94%)"
          opacity="0.5"
        />{" "}
        {/* --muted */}
        {/* Shield Base */}
        <path
          d="M400 150L550 200V350C550 450 400 500 400 500C400 500 250 450 250 350V200L400 150Z"
          fill="hsl(225 55% 27%)" /* --primary */
          filter="url(#shadow)"
          opacity="0.9"
        />
        {/* Location Pin */}
        <path
          d="M400 250C420 250 435 265 435 285C435 295 430 305 420 310L400 340L380 310C370 305 365 295 365 285C365 265 380 250 400 250Z"
          fill="hsl(0 0% 100%)" /* --primary-foreground */
        />
        {/* Pulse Rings */}
        <circle
          cx="400"
          cy="285"
          r="40"
          stroke="hsl(0 0% 100%)" /* --primary-foreground */
          strokeWidth="2"
          opacity="0.3"
        >
          <animate
            attributeName="r"
            from="20"
            to="60"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.3"
            to="0"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Community Connection Lines */}
        <g stroke="hsl(358 65% 40%)" strokeWidth="1.5" opacity="0.6">
          {" "}
          {/* --secondary */}
          <line x1="320" y1="380" x2="480" y2="380">
            <animate
              attributeName="opacity"
              values="0.6;0.2;0.6"
              dur="3s"
              repeatCount="indefinite"
            />
          </line>
          <line x1="350" y1="400" x2="450" y2="400">
            <animate
              attributeName="opacity"
              values="0.6;0.2;0.6"
              dur="3s"
              repeatCount="indefinite"
              begin="1s"
            />
          </line>
          <line x1="380" y1="420" x2="420" y2="420">
            <animate
              attributeName="opacity"
              values="0.6;0.2;0.6"
              dur="3s"
              repeatCount="indefinite"
              begin="2s"
            />
          </line>
        </g>
        {/* Filters */}
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="10"
              floodColor="hsl(224 71% 4%)" /* --foreground */
              floodOpacity="0.2"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
