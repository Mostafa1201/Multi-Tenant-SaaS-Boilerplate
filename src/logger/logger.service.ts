import { Injectable } from '@nestjs/common';
import { Logger } from './logger';
@Injectable()
export class LoggerService extends Logger {}
