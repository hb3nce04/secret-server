import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateSecretDto {
	@IsString()
	@IsNotEmpty()
	secret: string; // This text will be saved as a secret

	@Type(() => Number)
	@IsNumber()
	@Min(1)
	@IsNotEmpty()
	expireAfterViews: number; // The secret won't be available after the given number of views. It must be greater than 0.

	@Type(() => Number)
	@IsNumber()
	@IsNotEmpty()
	expireAfter: number; // The secret won't be available after the given time. The value is provided in minutes. 0 means never expires
}
