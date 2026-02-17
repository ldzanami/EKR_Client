import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

export const accessInterceptor: HttpInterceptorFn = (request, next) => {
    const auth = inject(AuthService);

    const accessToken = auth.getAccessToken;

    const mutateRequest = accessToken 
    ? request.clone({
        setHeaders: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    : request;

    if(!accessToken && !request.url.includes('refresh') && !request.url.includes('get-public-key')) {
        auth.refreshAccessToken();
    }

    return next(mutateRequest);
}
