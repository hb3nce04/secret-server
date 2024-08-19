import { Body, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Secret } from "./schema/secret.schema";
import { Model } from "mongoose";
import { CreateSecretDto } from "./dto/create-secret.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class SecretService {
	constructor(@InjectModel(Secret.name) private secretModel: Model<Secret>) {}

	async createSecret(@Body() createSecretDto: CreateSecretDto) {
		const currentDate = new Date();
		const secretText = createSecretDto.secret;
		const hash = await bcrypt.hash(secretText + process.env.SECRET_SALT, 8);
		const newSecret = new this.secretModel({
			secretText,
			hash,
			remainingViews: createSecretDto.expireAfterViews,
			createdAt: currentDate,
			expiresAt: new Date(
				currentDate.getTime() + createSecretDto.expireAfter * 60 * 1000
			)
		});
		await newSecret.save();
		return newSecret;
	}

	getSecrets() {
		return this.secretModel.find();
	}

	async getSecretByHash(hash: string) {
		const currentDate = new Date();
		const foundSecret = await this.secretModel.findOneAndUpdate(
			{
				$and: [
					{
						hash,
						remainingViews: { $gt: 0 }
					},
					{
						$or: [
							{ expiresAt: { $gt: currentDate } },
							{ $expr: { $eq: ["$expiresAt", "$createdAt"] } }
						]
					}
				]
			},
			{ $inc: { remainingViews: -1 } },
			{ new: true }
		);
		if (!foundSecret) {
			throw new NotFoundException("Secret not found or expired");
		}
		return foundSecret;
	}
}
