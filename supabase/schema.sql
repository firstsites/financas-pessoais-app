-- Tabela de configurações do orçamento
CREATE TABLE budget_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  monthly_limit DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de custos fixos
CREATE TABLE fixed_costs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de gastos variáveis
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  category TEXT DEFAULT 'Geral',
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configuração inicial
INSERT INTO budget_settings (monthly_limit) VALUES (0);

-- Habilitar Row Level Security (RLS)
ALTER TABLE budget_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixed_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Políticas públicas (sem autenticação por enquanto)
CREATE POLICY "Allow all operations on budget_settings" ON budget_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on fixed_costs" ON fixed_costs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);
