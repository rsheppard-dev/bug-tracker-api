import base64 from 'base64-js';

function createImageUrl(
	byteArray: Uint8Array,
	contentType: string
): string | null {
	if (byteArray) {
		const base64String = base64.fromByteArray(byteArray);
		const url = `data:${contentType};base64,${base64String}`;
		return url;
	} else {
		return null;
	}
}

export default createImageUrl;
