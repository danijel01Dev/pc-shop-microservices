import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../global-response-dto/global-response.dto';

export function ApiErrorResponses() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Bad Request',
      type: ErrorResponseDto,
    }),
    ApiUnauthorizedResponse({
      description:
        'Unauthorized. Authentication is required or token is missing/invalid',
      type: ErrorResponseDto,
    }),
    ApiForbiddenResponse({
      description:
        'Forbidden. You do not have permission to access this resource',
      type: ErrorResponseDto,
    }),
    ApiInternalServerErrorResponse({
      description:
        'Internal server error. An unexpected error occurred on the server',
      type: ErrorResponseDto,
    }),
  );
}
