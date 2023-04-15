import { IsNotEmpty, IsString } from 'class-validator';

export class ValidationParam {
  @IsString()
  @IsNotEmpty()
  code: string;
}
