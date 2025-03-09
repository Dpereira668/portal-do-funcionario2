
import React from "react";

interface LoginBackgroundProps {
  children: React.ReactNode;
}

export const LoginBackground = ({ children }: LoginBackgroundProps) => {
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4"
      role="main"
      aria-labelledby="login-title"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&q=80&w=1920')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      {children}
    </div>
  );
};
