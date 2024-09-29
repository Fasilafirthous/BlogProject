import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { QueryRunner } from 'typeorm';
import * as chalk from 'chalk';
@Injectable()
export class MyLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    this.formatedLog(
      'error',
      `${message} -> (${stack || 'trace not provided !'})`,
      context,
      stack,
    );
  }

  log(message: string, context?: string) {
    this.formatedLog('info', message, context);
  }

  warn(message: string, context?: string) {
    this.formatedLog('warn', message, context);
  }

  debug(message: any, context?: string) {
    this.formatedLog('debug', message, context);
  }

  private formatedLog(level: string, message: string, context, error?): void {
    let result = '';
    const dateFormat = moment().format('DD/MM/YYYY');
    const timeFormat = moment().format('h:mm:ss a');
    const time = `${dateFormat}|${timeFormat}`;

    switch (level) {
      case 'info':
        result = `${chalk.yellow(time)}|${chalk.magentaBright(
          'INFO',
        )}|${chalk.green(context)}|${chalk.gray(message)}`;
        break;
      case 'error':
        result = `${chalk.yellow(time)}|${chalk.red('ERROR')}|${chalk.green(
          context,
        )}|${chalk.red(message)}`;
        break;
      case 'warn':
        result = `${chalk.yellow(time)}|${chalk.rgb(
          255,
          136,
          0,
        )('WARN')}|${chalk.green(context)}|${message}`;
        break;
      case 'debug':
        result = `${chalk.yellow(time)}|${chalk.blue('DEBUG')}|${chalk.green(
          context,
        )}|${message}`;
        break;
      default:
        break;
    }
    console.log(result);
  }
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.formatedLog(
      'info',
      `${query} params: ${JSON.stringify(parameters)}`,
      MyLogger.name,
    );
  }
  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
    this.formatedLog(
      'error',
      `${query} params: ${JSON.stringify(parameters)} error: ${error}`,
      MyLogger.name,
      error,
    );
  }
  /**
   * Logs query that is slow.
   */
  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
    this.formatedLog(
      'warn',
      `${query} params: ${JSON.stringify(parameters)} took longer time ${time}`,
      MyLogger.name,
    );
  }
  /**
   * Logs events from the schema build process.
   */
  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    this.formatedLog('debug', message, MyLogger.name);
  }
  /**
   * Logs events from the migrations run process.
   */
  logMigration(message: string, queryRunner?: QueryRunner): any {
    this.formatedLog('debug', message, MyLogger.name);
  }
}
