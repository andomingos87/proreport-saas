-- Script para criar a tabela de bookings no Supabase
-- Esta tabela armazena os agendamentos de inspeções

-- Criar a tabela bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES contacts(id),
  agent_id UUID REFERENCES contacts(id),
  property_address TEXT NOT NULL,
  property_unit TEXT,
  inspection_type TEXT NOT NULL,
  inspection_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_amount NUMERIC(10, 2),
  payment_discount NUMERIC(10, 2),
  contract_id UUID REFERENCES contracts(id),
  cover_letter_id UUID REFERENCES cover_letters(id),
  property_details JSONB,
  form_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Criar índices para otimizar consultas
CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_client_id_idx ON bookings(client_id);
CREATE INDEX IF NOT EXISTS bookings_agent_id_idx ON bookings(agent_id);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings(status);
CREATE INDEX IF NOT EXISTS bookings_payment_status_idx ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS bookings_inspection_date_idx ON bookings(inspection_date);

-- Configurar RLS (Row Level Security) para garantir que apenas o proprietário possa acessar seus próprios dados
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own bookings"
  ON bookings
  FOR ALL
  USING (auth.uid() = user_id);

-- Configurar trigger para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bookings_modtime
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

-- Comentários para documentação
COMMENT ON TABLE bookings IS 'Tabela que armazena os agendamentos de inspeções';
COMMENT ON COLUMN bookings.client_id IS 'ID do cliente associado ao agendamento';
COMMENT ON COLUMN bookings.agent_id IS 'ID do agente imobiliário associado ao agendamento';
COMMENT ON COLUMN bookings.property_address IS 'Endereço da propriedade a ser inspecionada';
COMMENT ON COLUMN bookings.property_unit IS 'Número da unidade/apartamento';
COMMENT ON COLUMN bookings.inspection_type IS 'Tipo de inspeção';
COMMENT ON COLUMN bookings.inspection_date IS 'Data e hora agendadas para a inspeção';
COMMENT ON COLUMN bookings.notes IS 'Observações adicionais sobre o agendamento';
COMMENT ON COLUMN bookings.status IS 'Status do agendamento (draft, scheduled, completed, cancelled)';
COMMENT ON COLUMN bookings.payment_status IS 'Status do pagamento (pending, paid, partial, refunded)';
COMMENT ON COLUMN bookings.payment_method IS 'Método de pagamento';
COMMENT ON COLUMN bookings.payment_amount IS 'Valor total do pagamento';
COMMENT ON COLUMN bookings.payment_discount IS 'Valor do desconto aplicado';
COMMENT ON COLUMN bookings.contract_id IS 'ID do contrato associado ao agendamento';
COMMENT ON COLUMN bookings.cover_letter_id IS 'ID da carta de apresentação associada ao agendamento';
COMMENT ON COLUMN bookings.property_details IS 'Detalhes da propriedade em formato JSON';
COMMENT ON COLUMN bookings.form_data IS 'Dados completos do formulário em formato JSON';
COMMENT ON COLUMN bookings.user_id IS 'ID do usuário proprietário do agendamento'; 