import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ThemeCustomization from "./themes";
import ScrollTop from "./components/ScrollTop";
import Routes from './routes'
function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeCustomization>
      <ScrollTop>
        <Routes />
      </ScrollTop>
    </ThemeCustomization>
  );
}

export default App;
