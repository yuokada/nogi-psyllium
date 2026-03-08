import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const URL_PARAM_KEYS = {
	SEARCH: "q",
	GEN_FILTER: "gen",
	GRADUATED: "graduated",
	UNDERLIVE_ID: "id",
	ABSENT: "absent",
	COMPANION: "companion",
} as const;

type UrlParamKey = (typeof URL_PARAM_KEYS)[keyof typeof URL_PARAM_KEYS];

type UrlParamsState = {
	search: string;
	genFilter: string;
	showAll: boolean;
	selectedUnderliveId: string;
	showAbsent: boolean;
	hasCompanionParam: boolean;
	companionInQuery: boolean;
};

type UrlParamsActions = {
	setSearch: (value: string) => void;
	setGenFilter: (value: string) => void;
	setShowAll: (value: boolean) => void;
	setShowAbsent: (value: boolean) => void;
	setSelectedUnderliveId: (id: string) => void;
	setCompanionInQuery: (value: boolean) => void;
};

type UrlParamsHook = UrlParamsState & UrlParamsActions;

export function useUrlParams(): UrlParamsHook {
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
		(key: UrlParamKey, value: string) => {
			updateParams((next) => {
				if (value) next.set(key, value);
				else next.delete(key);
			});
		},
		[updateParams],
	);

	const setBooleanFlagParam = useCallback(
		(key: UrlParamKey, enabled: boolean) => {
			updateParams((next) => {
				if (enabled) next.set(key, "1");
				else next.delete(key);
			});
		},
		[updateParams],
	);

	const search = searchParams.get(URL_PARAM_KEYS.SEARCH) ?? "";
	const genFilter = searchParams.get(URL_PARAM_KEYS.GEN_FILTER) ?? "";
	const showAll = searchParams.get(URL_PARAM_KEYS.GRADUATED) === "1";
	const selectedUnderliveId =
		searchParams.get(URL_PARAM_KEYS.UNDERLIVE_ID) ?? "";
	const showAbsent = searchParams.get(URL_PARAM_KEYS.ABSENT) === "1";
	const companionParam = searchParams.get(URL_PARAM_KEYS.COMPANION);
	const hasCompanionParam = companionParam !== null;
	const companionInQuery = companionParam === "1";

	const setSearch = useCallback(
		(value: string) => setOptionalParam(URL_PARAM_KEYS.SEARCH, value),
		[setOptionalParam],
	);

	const setGenFilter = useCallback(
		(value: string) => setOptionalParam(URL_PARAM_KEYS.GEN_FILTER, value),
		[setOptionalParam],
	);

	const setShowAll = useCallback(
		(value: boolean) => setBooleanFlagParam(URL_PARAM_KEYS.GRADUATED, value),
		[setBooleanFlagParam],
	);

	const setShowAbsent = useCallback(
		(value: boolean) => setBooleanFlagParam(URL_PARAM_KEYS.ABSENT, value),
		[setBooleanFlagParam],
	);

	const setSelectedUnderliveId = useCallback(
		(id: string) => setOptionalParam(URL_PARAM_KEYS.UNDERLIVE_ID, id),
		[setOptionalParam],
	);

	const setCompanionInQuery = useCallback(
		(value: boolean) => {
			updateParams((next) => {
				next.set(URL_PARAM_KEYS.COMPANION, value ? "1" : "0");
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
