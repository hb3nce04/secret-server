import { Module } from "@nestjs/common";
import { SecretModule } from "./secret/secret.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGO_URL, {
			dbName: process.env.MONGO_DB,
			user: process.env.MONGO_USERNAME,
			pass: process.env.MONGO_PASSWORD
		}),
		SecretModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
