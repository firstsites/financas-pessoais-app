
import React, { useState, useEffect, useMemo } from 'react';
import { Expense, FixedCost, BudgetData, ModalType } from './types';
import Card from './components/Card';

const App: React.FC = () => {
  const [data, setData] = useState<BudgetData>(() => {
    const saved = localStorage.getItem('finanza_data');
    if (saved) return JSON.parse(saved);
    return {
      monthlyLimit: 0,
      fixedCosts: [],
      expenses: []
    };
  });

  const [modal, setModal] = useState<ModalType>(ModalType.NONE);

  // Form states
  const [budgetInput, setBudgetInput] = useState(data.monthlyLimit.toString());
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [fixedDesc, setFixedDesc] = useState('');
  const [fixedAmount, setFixedAmount] = useState('');

  useEffect(() => {
    localStorage.setItem('finanza_data', JSON.stringify(data));
  }, [data]);

  const totalFixed = useMemo(() => 
    data.fixedCosts.reduce((acc, curr) => acc + curr.amount, 0), 
  [data.fixedCosts]);

  const totalExpenses = useMemo(() => 
    data.expenses.reduce((acc, curr) => acc + curr.amount, 0), 
  [data.expenses]);

  const remaining = useMemo(() => 
    data.monthlyLimit - totalFixed - totalExpenses, 
  [data.monthlyLimit, totalFixed, totalExpenses]);

  const handleUpdateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    setData(prev => ({ ...prev, monthlyLimit: parseFloat(budgetInput) || 0 }));
    setModal(ModalType.NONE);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseDesc || !expenseAmount) return;
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      description: expenseDesc,
      amount: parseFloat(expenseAmount),
      category: 'Geral',
      date: new Date().toISOString()
    };
    setData(prev => ({ ...prev, expenses: [newExpense, ...prev.expenses] }));
    setExpenseDesc('');
    setExpenseAmount('');
    setModal(ModalType.NONE);
  };

  const handleAddFixedCost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fixedDesc || !fixedAmount) return;
    const newFixed: FixedCost = {
      id: crypto.randomUUID(),
      description: fixedDesc,
      amount: parseFloat(fixedAmount)
    };
    setData(prev => ({ ...prev, fixedCosts: [...prev.fixedCosts, newFixed] }));
    setFixedDesc('');
    setFixedAmount('');
    setModal(ModalType.NONE);
  };

  const deleteExpense = (id: string) => {
    setData(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== id) }));
  };

  const deleteFixedCost = (id: string) => {
    setData(prev => ({ ...prev, fixedCosts: prev.fixedCosts.filter(f => f.id !== id) }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10 w-full shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#6366f1] rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <i className="fas fa-bolt text-lg"></i>
          </div>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight hidden sm:block">Finanza</span>
        </div>

        <div className="flex-1 flex justify-center max-w-md mx-4">
          <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 w-full">
            <i className="fas fa-search text-gray-400 text-sm"></i>
            <input type="text" placeholder="Buscar transações..." className="bg-transparent border-none outline-none text-sm text-gray-600 w-full" />
            <span className="text-[10px] font-bold text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded-md hidden md:inline">⌘ F</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
            <i className="far fa-bell"></i>
          </button>
          <button 
            onClick={() => setModal(ModalType.ADD_EXPENSE)}
            className="bg-[#6366f1] text-white text-sm font-bold px-4 sm:px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <i className="fas fa-plus"></i> <span className="hidden sm:inline">Novo Gasto</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 flex-1">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Painel de Controle</h2>
            <p className="text-sm text-gray-500 mt-0.5">Visão geral das suas finanças este mês</p>
          </div>
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
            <button className="px-4 py-1.5 text-xs font-bold bg-gray-50 text-indigo-600 rounded-lg">Mensal</button>
            <button className="px-4 py-1.5 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">Anual</button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card 
            title="Orçamento Total" 
            value={data.monthlyLimit} 
            icon="fa-vault" 
            color="text-indigo-600" 
            trend="+2.5%"
          />
          <Card 
            title="Disponível" 
            value={remaining} 
            icon="fa-wallet" 
            color={remaining >= 0 ? "text-cyan-600" : "text-rose-600"} 
            trend={remaining >= 0 ? "+15.8%" : "-5.2%"}
          />
          <Card 
            title="Custos Fixos" 
            value={totalFixed} 
            icon="fa-lock" 
            color="text-amber-600" 
            trend="Estável"
          />
          <Card 
            title="Gastos Variáveis" 
            value={totalExpenses} 
            icon="fa-cart-shopping" 
            color="text-violet-600" 
            trend="+34.0%"
          />
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Gastos Variáveis Table */}
          <div className="xl:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Lista de Gastos</h3>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mt-1">Variáveis</p>
              </div>
              <div className="flex gap-2">
                <button className="text-xs font-bold text-gray-400 px-3 py-1.5 hover:bg-gray-50 rounded-lg transition-colors">Filtrar</button>
                <button className="text-xs font-bold text-gray-400 px-3 py-1.5 hover:bg-gray-50 rounded-lg transition-colors">Exportar</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                    <th className="pb-4 px-2">Descrição</th>
                    <th className="pb-4 px-2">Data</th>
                    <th className="pb-4 px-2 text-right">Valor</th>
                    <th className="pb-4 px-2 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.expenses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-20">
                          <i className="fas fa-receipt text-4xl"></i>
                          <p className="text-sm font-bold">Nenhum gasto registrado</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.expenses.map((expense) => (
                      <tr key={expense.id} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
                              <i className="fas fa-tag text-xs"></i>
                            </div>
                            <span className="text-sm font-bold text-gray-800">{expense.description}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-xs font-semibold text-gray-400">
                          {new Date(expense.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <span className="text-sm font-bold text-gray-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense.amount)}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <button 
                            onClick={() => deleteExpense(expense.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 md:group-hover:opacity-100"
                          >
                            <i className="fas fa-trash-can text-xs"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Custos Fixos List */}
          <div className="xl:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Custos Fixos</h3>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mt-1">Recorrentes</p>
              </div>
              <button 
                onClick={() => setModal(ModalType.ADD_FIXED_COST)}
                className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-colors"
              >
                <i className="fas fa-plus text-xs"></i>
              </button>
            </div>

            <div className="space-y-4">
              {data.fixedCosts.length === 0 ? (
                <div className="py-10 text-center opacity-30">
                  <p className="text-xs font-bold">Sem contas fixas</p>
                </div>
              ) : (
                data.fixedCosts.map((fixed) => (
                  <div key={fixed.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 group">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-amber-500 shadow-sm">
                         <i className="fas fa-calendar-check text-xs"></i>
                       </div>
                       <span className="text-sm font-bold text-gray-800">{fixed.description}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(fixed.amount)}
                      </span>
                      <button 
                        onClick={() => deleteFixedCost(fixed.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-rose-500 transition-all opacity-0 md:group-hover:opacity-100"
                      >
                        <i className="fas fa-trash-can text-xs"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-50">
               <button 
                  onClick={() => setModal(ModalType.BUDGET_SETTINGS)}
                  className="w-full py-4 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
               >
                 <i className="fas fa-cog"></i> Configurar Orçamento Total
               </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer User Info */}
      <footer className="p-8 flex justify-center opacity-50">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-[#22d3ee] flex items-center justify-center text-white font-bold text-[10px]">
             YA
           </div>
           <div>
             <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Nexus Business Plan</p>
           </div>
        </div>
      </footer>

      {/* Modals */}
      {modal !== ModalType.NONE && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-10 relative border border-gray-100">
            <button 
              onClick={() => setModal(ModalType.NONE)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>

            {modal === ModalType.BUDGET_SETTINGS && (
              <form onSubmit={handleUpdateBudget} className="space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Orçamento Mensal</h3>
                  <p className="text-sm text-gray-400 mt-1">Defina seu teto de gastos para o período.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Valor Limite</label>
                  <div className="relative">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">R$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full pl-8 pr-4 bg-transparent text-3xl font-extrabold text-gray-900 outline-none border-none placeholder:text-gray-200"
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(e.target.value)}
                      placeholder="0,00"
                      autoFocus
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#6366f1] text-white font-bold py-4 rounded-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                  Salvar Alterações
                </button>
              </form>
            )}

            {modal === ModalType.ADD_EXPENSE && (
              <form onSubmit={handleAddExpense} className="space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Novo Gasto</h3>
                  <p className="text-sm text-gray-400 mt-1">Adicione uma despesa variável.</p>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Descrição</label>
                    <input 
                      type="text" 
                      className="w-full bg-transparent text-gray-900 font-bold outline-none border-none placeholder:text-gray-300"
                      value={expenseDesc}
                      onChange={(e) => setExpenseDesc(e.target.value)}
                      placeholder="Ex: Mercado, Uber..."
                      autoFocus
                    />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Valor</label>
                    <div className="relative flex items-center">
                      <span className="text-lg font-bold text-gray-400 mr-2">R$</span>
                      <input 
                        type="number" 
                        step="0.01"
                        className="w-full bg-transparent text-2xl font-extrabold text-gray-900 outline-none border-none placeholder:text-gray-200"
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#6366f1] text-white font-bold py-4 rounded-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                  Adicionar Transação
                </button>
              </form>
            )}

            {modal === ModalType.ADD_FIXED_COST && (
              <form onSubmit={handleAddFixedCost} className="space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Nova Conta Fixa</h3>
                  <p className="text-sm text-gray-400 mt-1">Contas que se repetem todos os meses.</p>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Nome da Conta</label>
                    <input 
                      type="text" 
                      className="w-full bg-transparent text-gray-900 font-bold outline-none border-none placeholder:text-gray-300"
                      value={fixedDesc}
                      onChange={(e) => setFixedDesc(e.target.value)}
                      placeholder="Ex: Aluguel, Netflix..."
                      autoFocus
                    />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Valor Fixo</label>
                    <div className="relative flex items-center">
                      <span className="text-lg font-bold text-gray-400 mr-2">R$</span>
                      <input 
                        type="number" 
                        step="0.01"
                        className="w-full bg-transparent text-2xl font-extrabold text-gray-900 outline-none border-none placeholder:text-gray-200"
                        value={fixedAmount}
                        onChange={(e) => setFixedAmount(e.target.value)}
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full bg-amber-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-amber-100 hover:bg-amber-600 transition-all">
                  Salvar Conta
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
