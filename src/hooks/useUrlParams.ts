import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export function useUrlParams() {
	const [searchParams, setSearchParams] = useSearchParams();

	const updateParams = useCallback(
		(mutator: (next: URLSearchParams) => void) => {
			setSearchParams(
				(prev) => {
					const next = new URLSearchParams(prev);
					mutator(next);
					return next;
				},
				{ replace: true },
			);
		},
		[setSearchParams],
	);

	const setOptionalParam = useCallback(
		(key: string, value: string) => {
			updateParams((next) => {
				if (value) next.set(key, value);
				else next.delete(key);
			});
		},
		[updateParams],
	);

	const setBooleanFlagParam = useCallback(
		(key: string, enabled: boolean) => {
			updateParams((next) => {
				if (enabled) next.set(key, "1");
				else next.delete(key);
			});
		},
		[updateParams],
	);

	const search = searchParams.get("q") ?? "";
	const genFilter = searchParams.get("gen") ?? "";
	const showAll = searchParams.get("graduated") === "1";
	const selectedUnderliveId = searchParams.get("id") ?? "";
	const showAbsent = searchParams.get("absent") === "1";
	const companionParam = searchParams.get("companion");
	const hasCompanionParam = companionParam !== null;
	const companionInQuery = companionParam === "1";

	const setSearch = useCallback(
		(value: string) => setOptionalParam("q", value),
		[setOptionalParam],
	);

	const setGenFilter = useCallback(
		(value: string) => setOptionalParam("gen", value),
		[setOptionalParam],
	);

	const setShowAll = useCallback(
		(value: boolean) => setBooleanFlagParam("graduated", value),
		[setBooleanFlagParam],
	);

	const setShowAbsent = useCallback(
		(value: boolean) => setBooleanFlagParam("absent", value),
		[setBooleanFlagParam],
	);

	const setSelectedUnderliveId = useCallback(
		(id: string) => setOptionalParam("id", id),
		[setOptionalParam],
	);

	const setCompanionInQuery = useCallback(
		(value: boolean) => {
			updateParams((next) => {
				next.set("companion", value ? "1" : "0");
			});
		},
		[updateParams],
	);

	return {
		search,
		genFilter,
		showAll,
		selectedUnderliveId,
		showAbsent,
		hasCompanionParam,
		companionInQuery,
		setSearch,
		setGenFilter,
		setShowAll,
		setShowAbsent,
		setSelectedUnderliveId,
		setCompanionInQuery,
	};
}
