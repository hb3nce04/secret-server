import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";

@Schema({
	timestamps: {
		createdAt: true,
		updatedAt: false
	}
})
export class Secret {
	@Prop({ required: true })
	hash: string; // Unique hash to identify the secrets

	@Prop({ required: true })
	secretText: string; // The secret itself

	@Prop({ required: true })
	remainingViews: number; // How many times the secret can be viewed

	@Prop({ required: true })
	expiresAt: Date; // The secret cannot be reached after this time
}

export const SecretSchema = SchemaFactory.createForClass(Secret);
