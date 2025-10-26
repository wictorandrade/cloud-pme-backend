import { Injectable } from '@nestjs/common';
import { Options, parse, stringify } from 'telejson';

@Injectable()
export class JsonHelper {
  stringify(json: any, options?: Partial<Options>): string {
    return stringify(json, options);
  }

  parse<Data = any>(json: string, options?: Partial<Options>): Data {
    return parse(json, options);
  }

  bigIntJSONParse(key: any, value: any) {
    if (typeof value === 'bigint') {
      return value.toString() + 'n';
    }
    return value;
  }

  bigIntObjectParse(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    for (const key in obj) {
      if (typeof obj[key] === 'bigint') {
        obj[key] = obj[key].toString() + 'n';
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.bigIntObjectParse(obj[key]); // Chamada recursiva para objetos aninhados
      }
    }

    return obj;
  }

  bigIntFromStringParse(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    for (const key in obj) {
      const isBigIntAsString =
        typeof obj[key] === 'string' && obj[key].endsWith('n');
      if (isBigIntAsString) {
        const bigIntString = obj[key].replace('n', '');
        const hasOnlyNumbers = /^\d+$/.test(bigIntString);
        if (hasOnlyNumbers) {
          obj[key] = BigInt(bigIntString);
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.bigIntFromStringParse(obj[key]); // Chamada recursiva para objetos aninhados
      }
    }

    return obj;
  }

  bigIntParseForAuditorias(key: any, value: any) {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  }
}
