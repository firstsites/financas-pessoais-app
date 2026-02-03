
export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface FixedCost {
  id: string;
  description: string;
  amount: number;
}

export interface BudgetData {
  monthlyLimit: number;
  fixedCosts: FixedCost[];
  expenses: Expense[];
}

export enum ModalType {
  NONE,
  BUDGET_SETTINGS,
  ADD_EXPENSE,
  ADD_FIXED_COST
}
