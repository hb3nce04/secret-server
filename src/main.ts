import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { readFileSync } from "fs";
import { parse } from "yaml";
import { SwaggerModule } from "@nestjs/swagger";
import { HttpStatus, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);
	const port = configService.get("PORT");

	app.useGlobalPipes(
		new ValidationPipe({
			errorHttpStatusCode: HttpStatus.METHOD_NOT_ALLOWED
		})
	);

	const document = readFileSync("./swagger.yaml", "utf8");
	SwaggerModule.setup("docs", app, parse(document));

	await app.listen(port || 3000);
}
bootstrap();
