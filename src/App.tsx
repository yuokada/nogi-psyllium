import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { AppFooter } from "./components/AppFooter";
import { BookmarkletPanel } from "./components/BookmarkletPanel";
import { GithubCorner } from "./components/GithubCorner";
import { MemberCard } from "./components/MemberCard";
import { QuizPanel } from "./components/QuizPanel";
import { UnderlivePanel } from "./components/UnderlivePanel";
import { useUrlParams } from "./hooks/useUrlParams";
import type { Member, Underlive } from "./types";
import "./App.css";

type AppTab = "penlight" | "underlive" | "quiz" | "bookmarklet";
const APP_TAB_PATHS: Record<AppTab, string> = {
	penlight: "/",
	underlive: "/underlive",
	quiz: "/quiz",
	bookmarklet: "/bookmarklet",
};

function getTabFromPathname(pathname: string): AppTab {
	const tab = (Object.keys(APP_TAB_PATHS) as AppTab[]).find(
		(key) => APP_TAB_PATHS[key] === pathname,
	);
	return tab ?? "penlight";
}

const isMember = (value: unknown): value is Member => {
	if (!value || typeof value !== "object") return false;
	const v = value as Record<string, unknown>;
	return (
		typeof v.id === "string" &&
		typeof v.name === "string" &&
		typeof v.color1_name === "string"
	);
};

const isUnderlive = (value: unknown): value is Underlive => {
	if (!value || typeof value !== "object") return false;
	const v = value as Record<string, unknown>;
	return (
		typeof v.id === "string" &&
		typeof v.title === "string" &&
		typeof v.year === "number" &&
		Array.isArray(v.dates) &&
		Array.isArray(v.member_ids)
	);
};

const fetchMembers = async (url: string): Promise<Member[]> => {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`データ読み込みエラー: ${res.status}`);
	const json: unknown = await res.json();
	if (!Array.isArray(json) || !json.every(isMember)) {
		throw new Error("メンバーデータの形式が不正です");
	}
	return json;
};

const fetchUnderlives = async (url: string): Promise<Underlive[]> => {
	try {
		const res = await fetch(url);
		if (!res.ok) return [];
		const json: unknown = await res.json();
		if (!Array.isArray(json) || !json.every(isUnderlive)) return [];
		return json;
	} catch {
		return [];
	}
};

function isNonEmptyString(value: string | undefined): value is string {
	return typeof value === "string" && value.length > 0;
}

function App() {
	const location = useLocation();
	const navigate = useNavigate();
	const {
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
	} = useUrlParams();

	const membersPath = `${import.meta.env.BASE_URL}data/members.json`;
	const underlivesPath = `${import.meta.env.BASE_URL}data/underlives.json`;

	const {
		data: membersData,
		error: membersError,
		isLoading: membersLoading,
	} = useSWR(membersPath, fetchMembers, {
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		shouldRetryOnError: false,
	});
	const { data: underlivesData } = useSWR(underlivesPath, fetchUnderlives, {
		shouldRetryOnError: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});

	const members = membersData ?? [];
	const underlives = underlivesData ?? [];

	const tab = getTabFromPathname(location.pathname);

	const [inputValue, setInputValue] = useState(() => search);
	const composingRef = useRef(false);

	useEffect(() => {
		if (!composingRef.current) {
			setInputValue(search);
		}
	}, [search]);

	useEffect(() => {
		if (
			underlives.length > 0 &&
			tab === "underlive" &&
			!underlives.find((u) => u.id === selectedUnderliveId)
		) {
			setSelectedUnderliveId(underlives[0].id);
		}
	}, [underlives, tab, selectedUnderliveId, setSelectedUnderliveId]);

	function setTab(newTab: AppTab) {
		navigate(APP_TAB_PATHS[newTab]);
	}

	const generations = useMemo(() => {
		const gens = new Set<string>();
		members.forEach((m) => {
			if (m.gen) gens.add(m.gen);
		});
		return Array.from(gens).sort();
	}, [members]);

	const filtered = useMemo(() => {
		return members.filter((m) => {
			if (!showAll && m.active !== true) return false;
			if (genFilter && m.gen !== genFilter) return false;
			if (search) {
				const q = search.toLowerCase();
				const fields = [m.name, m.call, m.color1_name, m.color2_name].filter(
					isNonEmptyString,
				);
				return fields.some((f) => f.toLowerCase().includes(q));
			}
			return true;
		});
	}, [members, search, genFilter, showAll]);

	if (membersLoading) return <div className="loading">読み込み中...</div>;
	if (membersError)
		return <div className="error">エラー: {membersError.message}</div>;

	return (
		<>
			<GithubCorner href="https://github.com/yuokada/nogi-psyllium" />
			<div className="app">
				<h1>乃木坂46 サイリウムカラーViewer</h1>
				<div className="tabs">
					<button
						type="button"
						className={tab === "penlight" ? "tab active" : "tab"}
						onClick={() => setTab("penlight")}
					>
						サイリウムカラー
					</button>
					<button
						type="button"
						className={tab === "underlive" ? "tab active" : "tab"}
						onClick={() => setTab("underlive")}
					>
						アンダーライブ
					</button>
					<button
						type="button"
						className={tab === "quiz" ? "tab active" : "tab"}
						onClick={() => setTab("quiz")}
					>
						クイズ
					</button>
					<button
						type="button"
						className={tab === "bookmarklet" ? "tab active" : "tab"}
						onClick={() => setTab("bookmarklet")}
					>
						ブックマークレット
					</button>
					<button
						type="button"
						className="copy-link-btn"
						onClick={() => {
							navigator.clipboard.writeText(window.location.href);
						}}
					>
						リンクをコピー
					</button>
				</div>

				{tab === "penlight" && (
					<>
						<div className="controls">
							<input
								type="text"
								className="search-input"
								placeholder="名前・コール・色名で検索..."
								value={inputValue}
								onChange={(e) => {
									setInputValue(e.target.value);
									if (!composingRef.current) {
										setSearch(e.target.value);
									}
								}}
								onCompositionStart={() => {
									composingRef.current = true;
								}}
								onCompositionEnd={(e) => {
									composingRef.current = false;
									setSearch(e.currentTarget.value);
								}}
							/>
							<select
								className="gen-select"
								value={genFilter}
								onChange={(e) => setGenFilter(e.target.value)}
							>
								<option value="">すべての期</option>
								{generations.map((g) => (
									<option key={g} value={g}>
										{g}
									</option>
								))}
							</select>
							<label className="show-all-label">
								<input
									type="checkbox"
									checked={showAll}
									onChange={(e) => setShowAll(e.target.checked)}
								/>
								卒業メンバーを含む
							</label>
						</div>
						<div className="member-count">{filtered.length}件表示</div>
						<div className="card-grid">
							{filtered.map((member) => (
								<MemberCard key={member.id} member={member} />
							))}
						</div>
					</>
				)}

				{tab === "underlive" && (
					<UnderlivePanel
						underlives={underlives}
						members={members}
						selectedId={selectedUnderliveId}
						onSelectId={setSelectedUnderliveId}
						showAbsent={showAbsent}
						onShowAbsentChange={setShowAbsent}
					/>
				)}

				{tab === "quiz" && <QuizPanel members={members} />}
				{tab === "bookmarklet" && (
					<BookmarkletPanel
						hasCompanionParam={hasCompanionParam}
						companionInQuery={companionInQuery}
						onCompanionQueryChange={setCompanionInQuery}
					/>
				)}

				<AppFooter />
			</div>
		</>
	);
}

export default App;
