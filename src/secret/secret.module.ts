import { Module } from "@nestjs/common";
import { SecretController } from "./secret.controller";
import { SecretService } from "./secret.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Secret, SecretSchema } from "./schema/secret.schema";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Secret.name, schema: SecretSchema }])
	],
	controllers: [SecretController],
	providers: [SecretService]
})
export class SecretModule {}
