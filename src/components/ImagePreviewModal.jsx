import React from "react";

function ImagePreviewModal({ imageUrl, onClose }) {
	if (!imageUrl) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
			onClick={onClose}
		>
			<div
				className="relative max-w-4xl max-h-full p-4"
				onClick={(e) => e.stopPropagation()}
			>
				<img
					src={imageUrl}
					alt="Preview"
					className="object-contain w-full h-full"
				/>
				<button
					onClick={onClose}
					className="absolute bottom-4 right-4 px-4 py-2 text-white bg-black rounded-full bg-opacity-50 hover:bg-opacity-75"
				>
					X
				</button>
			</div>
		</div>
	);
}

export default ImagePreviewModal;
