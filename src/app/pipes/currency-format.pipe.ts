import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currencyFormat'
})

export class CurrencyFormatPipe extends CurrencyPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (!value) {
            return 'R$ 0,00';
        }

        const currencyCode = 'BRL';
        const symbol = 'symbol';
        return super.transform(value, currencyCode, symbol);
    }
}
