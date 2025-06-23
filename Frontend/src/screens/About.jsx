import React, { useState } from "react";

const About = () => {
  const [buttonPosition, setButtonPosition] = useState({ left: 10, top: 10 });

  const handleMouseOver = () => {
    setButtonPosition({
      left: Math.random() * 80,
      top: Math.random() * 80,
    });
  };

  return (
    <div className="relative border-2 border-amber-500 h-96 w-full">
      {" "}
      {/* Added specific height */}
      <button
        onMouseOver={handleMouseOver}
        style={{
          left: `${buttonPosition.left}%`,
          top: `${buttonPosition.top}%`,
        }}
        className="absolute bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded transition-all duration-300 ease-in-out"
      >
        Hover me!
      </button>
    </div>
  );
};

export default About;
