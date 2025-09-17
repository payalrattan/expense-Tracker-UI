export interface IncomeVM {
  amount: number;
  source: string;
  description: string;
  date: string;
  userId: string; // the logged-in user's ID
}
