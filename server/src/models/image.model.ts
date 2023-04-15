import { prop } from '@typegoose/typegoose';

export class Image {
	@prop()
	contentType: string;

	@prop()
	data: Buffer;
}
