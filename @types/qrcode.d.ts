declare module "qrcode" {
	interface QRCodeToDataURLOptions {
		width?: number;
		margin?: number;
	}
	interface QRCode {
		toDataURL(text: string, options?: QRCodeToDataURLOptions): Promise<string>;
	}
	const qrcode: QRCode;
	export default qrcode;
}
