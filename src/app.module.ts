import { Module } from "@nestjs/common";
import { SecretModule } from "./secret/secret.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { TransformInterceptor } from "./interceptor/transform.interceptor";
import { AppController } from "./app.controller";

@Module({
	imports: [
		ConfigModule.forRoot(),
		ThrottlerModule.forRoot([
			{
				ttl: 1000,
				limit: 5
			},
			{
				ttl: 60000,
				limit: 100
			}
		]),
		MongooseModule.forRoot(process.env.MONGO_URL, {
			dbName: process.env.MONGO_DB
		}),
		SecretModule
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor
		}
	]
})
export class AppModule {}
