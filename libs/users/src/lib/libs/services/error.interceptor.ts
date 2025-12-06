import { Injectable } from '@angular/core';
import { 
  HttpInterceptor, 
  HttpRequest, 
  HttpHandler, 
  HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          switch (error.status) {
            case 0:
              errorMessage = 'Backend service is currently unavailable. Using local data.';
              console.warn('Backend connection failed - falling back to mock data');
              break;
            case 401:
              errorMessage = 'Unauthorized access - please login again.';
              break;
            case 403:
              errorMessage = 'Access forbidden.';
              break;
            case 404:
              errorMessage = 'Resource not found.';
              break;
            case 500:
              errorMessage = 'Internal server error.';
              break;
            default:
              errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }
        }
        
        // Log error for debugging but don't show intrusive alerts
        console.error('HTTP Error:', errorMessage);
        
        // Re-throw the error so individual services can handle it
        return throwError(() => error);
      })
    );
  }
}