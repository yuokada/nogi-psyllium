import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AppFooter } from "./components/AppFooter";
import { GithubCorner } from "./components/GithubCorner";
import { MemberCard } from "./components/MemberCard";
import { QuizPanel } from "./components/QuizPanel";
import { UnderlivePanel } from "./components/UnderlivePanel";
import type { Member, Underlive } from "./types";
import "./App.css";

type AppState = {
	members: Member[];
	underlives: Underlive[];
	loading: boolean;
	error: string | null;
};

type AppAction =
	| { type: "membersLoaded"; payload: Member[] }
	| { type: "membersLoadFailed"; payload: string }
	| { type: "underlivesLoaded"; payload: Underlive[] };

const initialState: AppState = {
	members: [],
	underlives: [],
	loading: true,
	error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
	switch (action.type) {
		case "membersLoaded":
			return {
				...state,
				members: action.payload,
				loading: false,
				error: null,
			};
		case "membersLoadFailed":
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		case "underlivesLoaded":
			return {
				...state,
				underlives: action.payload,
			};
		default:
			return state;
	}
}

function App() {
	const location = useLocation();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	const [state, dispatch] = useReducer(appReducer, initialState);
	const { members, underlives, loading, error } = state;

	const tab =
		location.pathname === "/underlive"
			? "underlive"
			: location.pathname === "/quiz"
				? "quiz"
				: "penlight";

	const search = searchParams.get("q") ?? "";
	const genFilter = searchParams.get("gen") ?? "";
	const showAll = searchParams.get("graduated") === "1";
	const selectedUnderliveId = searchParams.get("id") ?? "";
	const showAbsent = searchParams.get("absent") === "1";

	const [inputValue, setInputValue] = useState(
		() => searchParams.get("q") ?? "",
	);
	const composingRef = useRef(false);

	useEffect(() => {
		if (!composingRef.current) {
			setInputValue(search);
		}
	}, [search]);

	useEffect(() => {
		const jsonPath = `${import.meta.env.BASE_URL}data/members.json`;
		fetch(jsonPath)
			.then((res) => {
				if (!res.ok) throw new Error(`データ読み込みエラー: ${res.status}`);
				return res.json() as Promise<Member[]>;
			})
			.then((data) => {
				dispatch({ type: "membersLoaded", payload: data });
			})
			.catch((err) => {
				dispatch({ type: "membersLoadFailed", payload: err.message });
			});
	}, []);

	useEffect(() => {
		const jsonPath = `${import.meta.env.BASE_URL}data/underlives.json`;
		fetch(jsonPath)
			.then((res) => {
				if (!res.ok) return [];
				return res.json() as Promise<Underlive[]>;
			})
			.then((data) => {
				dispatch({ type: "underlivesLoaded", payload: data });
			})
			.catch(() => {
				// underlives.json の読み込み失敗は無視する
			});
	}, []);

	useEffect(() => {
		if (
			underlives.length > 0 &&
			tab === "underlive" &&
			!underlives.find((u) => u.id === selectedUnderliveId)
		) {
			setSearchParams(
				(prev) => {
					const next = new URLSearchParams(prev);
					next.set("id", underlives[0].id);
					return next;
				},
				{ replace: true },
			);
		}
	}, [underlives, tab, selectedUnderliveId, setSearchParams]);

	function setTab(newTab: "penlight" | "underlive" | "quiz") {
		if (newTab === "underlive") navigate("/underlive");
		else if (newTab === "quiz") navigate("/quiz");
		else navigate("/");
	}

	function setSearch(value: string) {
		setSearchParams(
			(prev) => {
				const next = new URLSearchParams(prev);
				if (value) next.set("q", value);
				else next.delete("q");
				return next;
			},
			{ replace: true },
		);
	}

	function setGenFilter(value: string) {
		setSearchParams(
			(prev) => {
				const next = new URLSearchParams(prev);
				if (value) next.set("gen", value);
				else next.delete("gen");
				return next;
			},
			{ replace: true },
		);
	}

	function setShowAll(value: boolean) {
		setSearchParams(
			(prev) => {
				const next = new URLSearchParams(prev);
				if (value) next.set("graduated", "1");
				else next.delete("graduated");
				return next;
			},
			{ replace: true },
		);
	}

	function setShowAbsent(value: boolean) {
		setSearchParams(
			(prev) => {
				const next = new URLSearchParams(prev);
				if (value) next.set("absent", "1");
				else next.delete("absent");
				return next;
			},
			{ replace: true },
		);
	}

	function setSelectedUnderliveId(id: string) {
		setSearchParams(
			(prev) => {
				const next = new URLSearchParams(prev);
				if (id) next.set("id", id);
				else next.delete("id");
				return next;
			},
			{ replace: true },
		);
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
				const fields = [m.name, m.gen, m.color1_name, m.color2_name].filter(
					Boolean,
				);
				return fields.some((f) => f!.toLowerCase().includes(q));
			}
			return true;
		});
	}, [members, search, genFilter, showAll]);

	if (loading) return <div className="loading">読み込み中...</div>;
	if (error) return <div className="error">エラー: {error}</div>;

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
								placeholder="名前・期・色名で検索..."
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

				<AppFooter />
			</div>
		</>
	);
}

export default App;
