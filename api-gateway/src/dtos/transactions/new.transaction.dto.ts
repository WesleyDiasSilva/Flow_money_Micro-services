import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class NewTransactionDto {
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  value: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  category_id: number;

  @IsNotEmpty()
  @IsString()
  type: 'VARIABLE' | 'FIXED ';
  date: Date;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  flow: 'REVENUE' | 'EXPENSE';
}
