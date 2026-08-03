import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { initializeTheme } from "./theme";

const initialTheme = initializeTheme();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<HashRouter>
			<App initialTheme={initialTheme} />
		</HashRouter>
	</StrictMode>,
);
