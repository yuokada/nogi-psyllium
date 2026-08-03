import { useState } from "react";
import { applyTheme, getNextTheme, saveTheme, type Theme } from "../theme";

type ThemeToggleProps = {
	initialTheme: Theme;
};

export function ThemeToggle({ initialTheme }: ThemeToggleProps) {
	const [theme, setTheme] = useState(initialTheme);
	const nextTheme = getNextTheme(theme);

	function handleClick() {
		applyTheme(nextTheme);
		saveTheme(nextTheme);
		setTheme(nextTheme);
	}

	return (
		<button
			type="button"
			className="theme-toggle"
			onClick={handleClick}
			aria-label="ダークテーマ"
			aria-pressed={theme === "dark"}
			title={`ダークテーマを${theme === "dark" ? "オフ" : "オン"}にする`}
		>
			<span aria-hidden="true">🌙</span>
		</button>
	);
}
