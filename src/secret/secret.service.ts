import {
	Body,
	HttpStatus,
	Injectable,
	NotFoundException,
	Res
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Secret } from "./schema/secret.schema";
import { Model } from "mongoose";
import { CreateSecretDto } from "./dto/create-secret.dto";
import { Response } from "express";

@Injectable()
export class SecretService {
	constructor(@InjectModel(Secret.name) private secretModel: Model<Secret>) {}

	async createSecret(@Body() createSecretDto: CreateSecretDto) {
		const currentDate = new Date();
		const newSecret = new this.secretModel({
			hash: "asd",
			secretText: createSecretDto.secret,
			remainingViews: createSecretDto.expireAfterViews,
			expiresAt: new Date(
				currentDate.getTime() + createSecretDto.expireAfter * 60 * 1000
			)
		});
		await newSecret.save();
		return newSecret;
	}

	async getSecretByHash(hash: string) {
		const currentDate = new Date();
		const foundSecret = await this.secretModel.findOneAndUpdate(
			{ hash, expiresAt: { $gt: currentDate } },
			{ $inc: { remainingViews: -1 } },
			{ new: true }
		);
		if (!foundSecret) {
			throw new NotFoundException();
		} else {
			return foundSecret;
		}
	}
}
