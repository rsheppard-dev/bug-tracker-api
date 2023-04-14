import { prop } from '@typegoose/typegoose';

export class Image {
	@prop({ required: true })
	contentType: string;

	@prop({ required: true })
	data: Buffer;
}
