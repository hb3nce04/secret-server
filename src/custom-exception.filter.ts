import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException
} from "@nestjs/common";
import { Request, Response } from "express";
import { Builder } from "xml2js";
import { stringify } from "yaml";

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();
		const response = ctx.getResponse<Response>();
		const acceptHeader = request.get("accept");
		const status = exception.getStatus();
		const exceptionResponse = exception.getResponse();
		if (acceptHeader === "application/xml") {
			response
				.status(status)
				.send(
					new Builder().buildObject({ exception: exceptionResponse })
				);
		} else if (acceptHeader === "application/yaml") {
			response.status(status).send(stringify(exceptionResponse));
		} else {
			response.status(status).json(exceptionResponse);
		}
	}
}
