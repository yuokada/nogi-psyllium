import { useCallback, useEffect, useMemo, useState } from "react";
import type { Member } from "../types";

export type QuizPanelProps = {
	members: Member[];
};

export function QuizPanel({ members }: QuizPanelProps) {
	const activeMembers = useMemo(
		() => members.filter((m) => m.active === true),
		[members],
	);

	const [currentMember, setCurrentMember] = useState<Member | null>(null);
	const [answered, setAnswered] = useState(false);

	const generateQuestion = useCallback((memberList: Member[]) => {
		if (memberList.length === 0) return;
		const member = memberList[Math.floor(Math.random() * memberList.length)];
		setCurrentMember(member);
		setAnswered(false);
	}, []);

	useEffect(() => {
		generateQuestion(activeMembers);
	}, [activeMembers, generateQuestion]);

	if (activeMembers.length === 0) {
		return <div className="loading">メンバーデータがありません</div>;
	}

	if (!currentMember) {
		return <div className="loading">読み込み中...</div>;
	}

	const answerText = currentMember.color2_name
		? `${currentMember.color1_name} x ${currentMember.color2_name}`
		: currentMember.color1_name;

	return (
		<div className="quiz-panel">
			<div className="quiz-card">
				<p className="quiz-question">
					Q: {currentMember.name}のサイリウムカラーは?
				</p>
				{currentMember.gen && (
					<p className="quiz-member-gen">{currentMember.gen}</p>
				)}
				{!answered ? (
					<button
						type="button"
						className="quiz-reveal-btn"
						onClick={() => setAnswered(true)}
					>
						答えを見る
					</button>
				) : (
					<p className="quiz-answer">A: {answerText}</p>
				)}
			</div>
			{answered && (
				<button
					type="button"
					className="quiz-next-btn"
					onClick={() => generateQuestion(activeMembers)}
				>
					次の問題 →
				</button>
			)}
		</div>
	);
}
