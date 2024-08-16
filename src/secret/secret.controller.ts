import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Post,
	Res,
	UseInterceptors
} from "@nestjs/common";
import { SecretService } from "./secret.service";
import { CreateSecretDto } from "./dto/create-secret.dto";
import { Secret } from "./schema/secret.schema";
import { SecretInterceptor } from "./interceptor/secret.interceptor";
import { Response } from "express";

@Controller("secret")
@UseInterceptors(new SecretInterceptor<Secret>())
export class SecretController {
	constructor(private readonly secretService: SecretService) {}

	@Post()
	createSecret(
		@Body() createSecretDto: CreateSecretDto,
		@Res({ passthrough: true }) res: Response
	) {
		res.status(HttpStatus.OK);
		return this.secretService.createSecret(createSecretDto);
	}

	@Get(":hash")
	getSecretByHash(@Param("hash") hash: string) {
		return this.secretService.getSecretByHash(hash);
	}
}
