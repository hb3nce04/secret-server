import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor
} from "@nestjs/common";
import { Observable } from "rxjs";
import { Request, Response } from "express";
import { map } from "rxjs/operators";
import { stringify } from "yaml";
import { Builder } from "xml2js";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest<Request>();
		const acceptHeader = request.get("accept");
		if (acceptHeader === "application/xml") {
			context
				.switchToHttp()
				.getResponse<Response>()
				.set("Content-Type", "application/xml");
		} else if (acceptHeader === "application/yaml") {
			context
				.switchToHttp()
				.getResponse<Response>()
				.set("Content-Type", "application/yaml");
		} else {
			context
				.switchToHttp()
				.getResponse<Response>()
				.set("Content-Type", "application/json");
		}
		return next.handle().pipe(
			map((data) => {
				if (acceptHeader === "application/xml") {
					return new Builder().buildObject({ data });
				} else if (acceptHeader === "application/yaml") {
					return stringify(data);
				} else {
					return data;
				}
			})
		);
	}
}
