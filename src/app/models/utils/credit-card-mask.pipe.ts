import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'creditCardMaskPipe'
  })
export class CreditCardMaskPipe implements PipeTransform {
    transform(plainCreditCard: string, visibleDigits: number = 4): string {
        //const visibleDigits = 4;
        let maskedSection = plainCreditCard.slice(0, -visibleDigits);
        let visibleSection = plainCreditCard.slice(-visibleDigits);
        return maskedSection.replace(/./g, '*') + visibleSection;
      }
}
