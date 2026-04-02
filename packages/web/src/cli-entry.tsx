import { createRoot } from "react-dom/client";
import CliDocs from "./CliDocs.tsx";
import "./style.css";

createRoot(document.getElementById("app")!).render(<CliDocs />);
