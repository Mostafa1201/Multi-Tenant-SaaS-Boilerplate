import { applyDecorators } from '@nestjs/common';
import { TIME_IN_MILLISECONDS } from '../modules/common/constants';
import { Throttle } from '@nestjs/throttler';

export function Throttler(limit: number, timeFrame: number, blockDuration: number = 2 * 60) {
  timeFrame = timeFrame * TIME_IN_MILLISECONDS;
  blockDuration = blockDuration * TIME_IN_MILLISECONDS;
  return applyDecorators(Throttle({ default: { limit, ttl: timeFrame, blockDuration } }));
}
