import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Response<T> {
	data: T;
}

@Injectable()
export class SecretInterceptor<T> implements NestInterceptor<T, Response<T>> {
	intercept(
		context: ExecutionContext,
		next: CallHandler
	): Observable<Response<T>> {
		return next.handle().pipe(
			map((data) => {
				if (Array.isArray(data)) {
					return data.map((item) => this.excludeId(item));
				}
				return this.excludeId(data);
			})
		);
	}

	private excludeId(obj: any) {
		if (obj && obj._id) {
			const { _id, __v, ...data } = obj.toObject ? obj.toObject() : obj;
			return data;
		}
		return obj;
	}
}
