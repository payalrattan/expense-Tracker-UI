export interface IncomeVM {
  _id?: string;   // MongoDB ID
  userId?: string;
  amount: number;
  source: string;
  description?: string;
  date: string;
}
