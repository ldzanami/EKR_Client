import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

export const accessInterceptor: HttpInterceptorFn = (request, next) => {
    console.log('accessInterceptor');

    const auth = inject(AuthService);

    const accessToken = auth.getAccessToken;
    
    const mutateRequest = accessToken 
    ? request.clone({
        setHeaders: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    : request;

    return next(mutateRequest);
}
