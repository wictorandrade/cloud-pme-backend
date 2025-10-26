import { Injectable } from '@nestjs/common';

@Injectable()
export class NumberHelper {
  sharesStrFloatToBigInt(value: string): bigint {
    const sanitizedValue = this.removeTwoNumbersAfterDot(value);
    return this.floatBRLStringToBigInt(sanitizedValue);
  }

  removeTwoNumbersAfterDot(value: string): string {
    return value.trim().replace(/[.,]\d{2}$/, '');
  }

  floatBRLStringToBigInt(value: string): bigint {
    return BigInt(
      String(value)
        .replace(/[^\d,.]/g, '')
        .replace(/\./g, '')
        .replace(/,/g, '.')
        .replace(/\..*$/, '')
        .trim(),
    );
  }

  floatBRLStringToNumber(value: string): number {
    return Number(
      String(value)
        .replace(/[^\d,.]/g, '')
        .replace(/\./g, '')
        .replace(/,/g, '.')
        .trim(),
    );
  }

  calcBigIntPercent(value: bigint, total: bigint): number {
    if (total === BigInt(0)) {
      return 0;
    }

    return Number(value) / Number(total);
  }

  calcBigIntPercentWithMax(value: bigint, total: bigint): number {
    if (value >= total) {
      return 1;
    }

    return this.calcBigIntPercent(value, total);
  }

  isScientificNotation(value: string): boolean {
    return String(value).toLowerCase().includes('e');
  }

  getPercentualFromTotal(total: number, length: number): number {
    if (total === 0 || length === 0) {
      return 0;
    }
    return parseFloat(((total / length) * 100).toFixed(2));
  }
}
