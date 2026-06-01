import { useState, useEffect } from "react";
import AppPC from "./components/pc/AppPC";
import AppMobile from "./components/mobile/AppMobile";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const listener = (e: any) => setIsMobile(e.matches);
    setIsMobile(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  return isMobile;
}

function App() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <AppMobile />;
  } else {
    return <AppPC />;
  }
}

export default App;