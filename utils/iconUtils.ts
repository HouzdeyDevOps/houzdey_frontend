// import React from "react";
// import {
//     CookingPot,
//     Waves,
//     PawPrint,
//     Wind,
//     Droplets,
//     Refrigerator,
//     Camera,
//     Car,
// } from "lucide-react";

// export const getAmenityIcon = (icon: string) => {
//     switch (icon) {
//         case "CookingPot":
//             return React.createElement(CookingPot, { className: "w-5 h-5" });
//         case "garden":
//             return React.createElement(Waves, { className: "w-5 h-5" });
//         case "pets":
//             return React.createElement(PawPrint, { className: "w-5 h-5" });
//         case "ac":
//             return React.createElement(Wind, { className: "w-5 h-5" });
//         case "water":
//             return React.createElement(Droplets, { className: "w-5 h-5" });
//         case "fridge":
//             return React.createElement(Refrigerator, { className: "w-5 h-5" });
//         case "security":
//             return React.createElement(Camera, { className: "w-5 h-5" });
//         case "parking":
//             return React.createElement(Car, { className: "w-5 h-5" });
//         default:
//             return null;
//     }
// };
  
import React from "react";  
import {
    CookingPot, Waves, PawPrint, Wind, Droplets, Refrigerator, Camera, Car,
    Home, Coffee, Church, Baby, Wifi, Maximize2, Zap, Pipette, DoorClosed,
    FileText, ArrowUpDown, Bell, Shield, Video, PlayCircle, WavesLadder, Map,
    Cloud, CreditCard, Lamp, Briefcase, Building2, ShoppingCart, Stamp,
    Bath, Printer, Lock, Utensils, Dumbbell
  } from "lucide-react";
  
  export const getAmenityIcon = (icon: string) => {
    switch (icon) {
      case "CookingPot":
        return React.createElement(CookingPot, { className: "w-5 h-5" });
      case "garden":
        return React.createElement(Waves, { className: "w-5 h-5" });
      case "pets":
        return React.createElement(PawPrint, { className: "w-5 h-5" });
      case "ac":
        return React.createElement(Wind, { className: "w-5 h-5" });
      case "water":
        return React.createElement(Droplets, { className: "w-5 h-5" });
      case "fridge":
        return React.createElement(Refrigerator, { className: "w-5 h-5" });
      case "security":
        return React.createElement(Camera, { className: "w-5 h-5" });
      case "house":
        return React.createElement(Home, { className: "w-5 h-5" });
      case "coffee":
        return React.createElement(Coffee, { className: "w-5 h-5" });
      case "church":
        return React.createElement(Church, { className: "w-5 h-5" });
      case "baby":
        return React.createElement(Baby, { className: "w-5 h-5" });
      case "wifi":
        return React.createElement(Wifi, { className: "w-5 h-5" });
      case "maximize":
        return React.createElement(Maximize2, { className: "w-5 h-5" });
      case "zap":
        return React.createElement(Zap, { className: "w-5 h-5" });
      case "pipette":
        return React.createElement(Pipette, { className: "w-5 h-5" });
      case "door":
        return React.createElement(DoorClosed, { className: "w-5 h-5" });
      case "file":
        return React.createElement(FileText, { className: "w-5 h-5" });
      case "elevator":
        return React.createElement(ArrowUpDown, { className: "w-5 h-5" });
      case "bell":
        return React.createElement(Bell, { className: "w-5 h-5" });
      case "shield":
        return React.createElement(Shield, { className: "w-5 h-5" });
      case "camera":
        return React.createElement(Video, { className: "w-5 h-5" });
      case "playground":
        return React.createElement(PlayCircle, { className: "w-5 h-5" });
      case "pool":
        return React.createElement(WavesLadder, { className: "w-5 h-5" });
      case "map":
        return React.createElement(Map, { className: "w-5 h-5" });
      case "waves":
        return React.createElement(Waves, { className: "w-5 h-5" });
      case "ceiling":
        return React.createElement(Cloud, { className: "w-5 h-5" });
      case "lamp":
        return React.createElement(Lamp, { className: "w-5 h-5" });
      case "briefcase":
        return React.createElement(Briefcase, { className: "w-5 h-5" });
      case "mosque":
        return React.createElement(Building2, { className: "w-5 h-5" });
      case "shopping":
        return React.createElement(ShoppingCart, { className: "w-5 h-5" });
      case "stamp":
        return React.createElement(Stamp, { className: "w-5 h-5" });
      case "hot-tub":
        return React.createElement(Bath, { className: "w-5 h-5" });
      case "printer":
        return React.createElement(Printer, { className: "w-5 h-5" });
      case "lock":
        return React.createElement(Lock, { className: "w-5 h-5" });
      case "utensils":
        return React.createElement(Utensils, { className: "w-5 h-5" });
      case "dumbbell":
        return React.createElement(Dumbbell, { className: "w-5 h-5" });
      case "car":
        return React.createElement(Car, { className: "w-5 h-5" });
      default:
        return null;
    }
  };