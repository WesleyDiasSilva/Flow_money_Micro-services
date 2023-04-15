export class NewTransactionDto {
  user_id: number;
  value: number;
  categoryDefault: boolean;
  categoryId?: number;
  type: 'VARIABLE' | 'FIXED ';
  date: Date;
  description: string;
  flow: 'REVENUE' | 'EXPENSE';
}
