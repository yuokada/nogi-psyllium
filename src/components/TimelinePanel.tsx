import type { TimelineItem } from "../types";

export type TimelinePanelProps = {
	items: TimelineItem[];
};

export function TimelinePanel({ items }: TimelinePanelProps) {
	if (items.length === 0) {
		return <div className="loading">タイムラインデータがありません</div>;
	}

	return (
		<div className="timeline-panel">
			<div className="member-count">{items.length}件表示</div>
			<ul className="timeline-list">
				{items.map((item) => (
					<li key={item.id} className="timeline-row">
						<div className="timeline-date-column">
							<div
								className={`timeline-date-pill timeline-date-pill-${item.kind}`}
							>
								{item.displayDate}
							</div>
						</div>
						<div className="timeline-rail" aria-hidden="true">
							<span className={`timeline-node timeline-node-${item.kind}`} />
						</div>
						<div className="timeline-body">
							<div className="timeline-title-row">
								<h2 className="timeline-title">{item.title}</h2>
								<span className="timeline-kind">{item.label}</span>
							</div>
							{item.dates.length > 1 && (
								<ul className="timeline-dates">
									{item.dates.map((date) => (
										<li key={date} className="timeline-date">
											{date.replaceAll("-", ".")}
										</li>
									))}
								</ul>
							)}
							<div className="timeline-meta">
								{item.venue && (
									<span className="timeline-venue">{item.venue}</span>
								)}
								{item.sourceUrl && (
									<a
										href={item.sourceUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="timeline-source"
									>
										出典
									</a>
								)}
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
