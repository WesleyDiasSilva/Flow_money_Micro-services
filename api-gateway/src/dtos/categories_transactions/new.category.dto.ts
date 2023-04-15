import { IsNotEmpty, IsString } from 'class-validator';

export class NewCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
