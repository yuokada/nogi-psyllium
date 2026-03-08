import { type ChangeEvent, useEffect, useState } from "react";
import {
	type BookmarkletFormData,
	DEFAULT_FORM_DATA,
	parseStoredData,
	STORAGE_KEY,
} from "./shared";

type UseBookmarkletFormArgs = {
	hasCompanionParam: boolean;
	companionInQuery: boolean;
	onCompanionQueryChange: (value: boolean) => void;
};

export function useBookmarkletForm({
	hasCompanionParam,
	companionInQuery,
	onCompanionQueryChange,
}: UseBookmarkletFormArgs) {
	const [formData, setFormData] = useState<BookmarkletFormData>(() => {
		let stored: string | null = null;
		if (typeof window !== "undefined") {
			try {
				stored = window.sessionStorage.getItem(STORAGE_KEY);
			} catch {
				// sessionStorage may be unavailable in private mode or restricted environments
			}
		}

		const base = stored
			? { ...DEFAULT_FORM_DATA, ...parseStoredData(stored) }
			: { ...DEFAULT_FORM_DATA };

		if (hasCompanionParam) {
			base.companion = companionInQuery ? "あり" : "なし";
		}

		return base;
	});

	useEffect(() => {
		try {
			window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
		} catch {
			// sessionStorage may be unavailable in private mode or restricted environments
		}
	}, [formData]);

	useEffect(() => {
		if (!hasCompanionParam) return;
		const next = companionInQuery ? "あり" : "なし";
		setFormData((prev) =>
			prev.companion === next ? prev : { ...prev, companion: next },
		);
	}, [hasCompanionParam, companionInQuery]);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleCompanionChange = (value: "あり" | "なし") => {
		setFormData((prev) => ({ ...prev, companion: value }));
		onCompanionQueryChange(value === "あり");
	};

	return {
		formData,
		handleChange,
		handleCompanionChange,
	};
}
