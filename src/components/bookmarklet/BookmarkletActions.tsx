type BookmarkletActionsProps = {
	bookmarkletHref: string;
	copyStatus: string;
	onCopy: () => void;
};

export function BookmarkletActions({
	bookmarkletHref,
	copyStatus,
	onCopy,
}: BookmarkletActionsProps) {
	return (
		<>
			<p className="bookmarklet-help">
				下のリンクをブックマークバーにドラッグすると登録できます。
			</p>
			<a className="bookmarklet-link" href={bookmarkletHref}>
				楽天チケット 自動入力 ブックマークレット
			</a>
			<input
				className="bookmarklet-output"
				type="text"
				readOnly
				value={bookmarkletHref}
			/>
			<button type="button" className="bookmarklet-copy-btn" onClick={onCopy}>
				{copyStatus}
			</button>
		</>
	);
}
