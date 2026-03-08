import { useEffect, useRef, useState } from "react";
import { COPY_STATUS_RESET_DELAY } from "./shared";

export function useCopyStatus(bookmarkletHref: string) {
	const copyResetTimeoutRef = useRef<number | undefined>(undefined);
	const [copyStatus, setCopyStatus] = useState("コードをコピー");

	useEffect(() => {
		return () => {
			window.clearTimeout(copyResetTimeoutRef.current);
		};
	}, []);

	const scheduleReset = () => {
		copyResetTimeoutRef.current = window.setTimeout(
			() => setCopyStatus("コードをコピー"),
			COPY_STATUS_RESET_DELAY,
		);
	};

	const handleCopy = async () => {
		window.clearTimeout(copyResetTimeoutRef.current);

		if (!navigator.clipboard?.writeText) {
			setCopyStatus("コピー機能未対応");
			scheduleReset();
			return;
		}

		try {
			await navigator.clipboard.writeText(bookmarkletHref);
			setCopyStatus("コピーしました");
		} catch {
			setCopyStatus("コピー失敗");
		}

		scheduleReset();
	};

	return {
		copyStatus,
		handleCopy,
	};
}
