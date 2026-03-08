import { useMemo } from "react";
import { BookmarkletActions } from "./bookmarklet/BookmarkletActions";
import { BookmarkletFormFields } from "./bookmarklet/BookmarkletFormFields";
import { buildBookmarkletScript } from "./bookmarklet/shared";
import { useBookmarkletForm } from "./bookmarklet/useBookmarkletForm";
import { useCopyStatus } from "./bookmarklet/useCopyStatus";

type BookmarkletPanelProps = {
	hasCompanionParam: boolean;
	companionInQuery: boolean;
	onCompanionQueryChange: (value: boolean) => void;
};

export function BookmarkletPanel({
	hasCompanionParam,
	companionInQuery,
	onCompanionQueryChange,
}: BookmarkletPanelProps) {
	const { formData, handleChange, handleCompanionChange } = useBookmarkletForm({
		hasCompanionParam,
		companionInQuery,
		onCompanionQueryChange,
	});

	const bookmarkletScript = useMemo(
		() => buildBookmarkletScript(formData),
		[formData],
	);
	const bookmarkletHref = useMemo(
		() => `javascript:${encodeURIComponent(bookmarkletScript)}`,
		[bookmarkletScript],
	);

	const { copyStatus, handleCopy } = useCopyStatus(bookmarkletHref);

	return (
		<section className="bookmarklet-panel">
			<p className="bookmarklet-description">
				楽天チケット向け自動入力ブックマークレットを作成します。
			</p>
			<BookmarkletFormFields
				formData={formData}
				onChange={handleChange}
				onCompanionChange={handleCompanionChange}
			/>
			<BookmarkletActions
				bookmarkletHref={bookmarkletHref}
				copyStatus={copyStatus}
				onCopy={handleCopy}
			/>
		</section>
	);
}
