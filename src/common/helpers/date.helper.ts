import { format, subHours } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { ptBR } from 'date-fns/locale';

@Injectable()
export class DateHelper {
  formatAndFixFullDateToEmail(date: Date | string): string {
    const saoPauloDate = this.fixDateToBRSaoPaulo(date);
    return format(saoPauloDate, 'dd/MM/yyyy HH:mm');
  }

  formatAndFixFullDate(date: Date | string): string {
    const saoPauloDate = this.fixDateToBRSaoPaulo(date);
    return format(saoPauloDate, 'dd/MM/yyyy');
  }

  formatAndFixFullDateWithHour(date: Date | string): string {
    const saoPauloDate = this.fixDateToBRSaoPaulo(date);
    return format(saoPauloDate, "dd 'de' MMM 'de' yyyy, 'às' HH:mm:ss", {
      locale: ptBR,
    });
  }

  fixDateToBRSaoPaulo(date: Date | string): Date {
    return subHours(new Date(date), 3);
  }

  formatAndFixFullDateToRelatorioCover(date: Date | string): string {
    const saoPauloDate = this.fixDateToBRSaoPaulo(date);

    return format(saoPauloDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  }

  formatToFilePath(date: Date): string {
    return format(date, 'yyyy_MM_dd_HH_mm_ss');
  }

  formatAndFixFullDateAndHourToEmail(date: Date | string): string {
    const saoPauloDate = this.fixDateToBRSaoPaulo(date);
    return format(saoPauloDate, "dd/MM/yyyy '-' HH:mm", { locale: ptBR });
  }
}
