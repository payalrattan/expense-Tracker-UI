export interface ExpensesVM {
  amount: number;
  category: string;
  description: string;
  date: string;
  userId: string; // the logged-in user's ID
}
