import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  ApiPropertyOptional,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';

class PaginatedMetaResponse {
  @ApiProperty() itermsPerPage: number;
  @ApiProperty() totalItems: number;
  @ApiProperty() currentPage: number;
  @ApiProperty() sortBy: string;
  @ApiProperty() searchBy: string;
  @ApiProperty() search: string;
  @ApiProperty() filters: { [column: string]: string | string[] };
}

class PaginatedLinksResponse {
  @ApiPropertyOptional() first?: string;
  @ApiPropertyOptional() previous?: string;
  @ApiProperty() current: string;
  @ApiPropertyOptional() next?: string;
  @ApiPropertyOptional() last?: string;
}

class PaginatedResponse<T> {
  data: T[];

  @ApiProperty()
  meta: PaginatedMetaResponse;

  @ApiProperty()
  links: PaginatedLinksResponse;
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(props: {
  model: TModel;
  description?: string;
}) => {
  return applyDecorators(
    ApiExtraModels(PaginatedResponse, props.model),
    ApiOkResponse({
      description: props.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponse) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(props.model) },
              },
            },
          },
        ],
      },
    }),
  );
};

export function PaginateQueryOptions() {
  return applyDecorators(
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'search', required: false, type: String }),
    ApiQuery({ name: 'sortBy', required: false }),
    ApiQuery({ name: 'filter', required: false }),
  );
}
