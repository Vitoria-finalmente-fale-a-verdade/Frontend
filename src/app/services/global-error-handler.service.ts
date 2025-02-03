import {ErrorHandler, Injectable} from '@angular/core';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private messageService: MessageService) { }

  handleError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Algo de errado aconteceu!' });
    console.error(error);
  }
}
