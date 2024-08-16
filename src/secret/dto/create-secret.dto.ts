import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateSecretDto {
	@IsString()
	@IsNotEmpty()
	secret: string; // This text will be saved as a secret

	@IsNumber()
	@Min(1)
	@IsNotEmpty()
	expireAfterViews: number; // The secret won't be available after the given number of views. It must be greater than 0.

	@IsNumber()
	@IsNotEmpty()
	expireAfter: number; // The secret won't be available after the given time. The value is provided in minutes. 0 means never expires
}
