# Sistema de Agendamento de Inspeções

Este documento descreve o funcionamento do sistema de agendamento de inspeções do ProReport.

## Visão Geral

O sistema de agendamento permite criar e gerenciar inspeções através de um processo de várias etapas. Cada etapa coleta informações específicas e atualiza o banco de dados automaticamente, permitindo que o usuário possa interromper o processo e continuar mais tarde.

## Estrutura de Dados

O agendamento (booking) é armazenado no banco de dados com os seguintes campos principais:

- **ID**: Identificador único do agendamento
- **Status**: Estado atual do agendamento (rascunho, agendado, concluído, cancelado)
- **Dados do Cliente**: Informações sobre o cliente
- **Dados da Propriedade**: Endereço e características da propriedade
- **Dados do Agente**: Informações sobre o agente imobiliário (se aplicável)
- **Tipo de Inspeção**: Tipo de inspeção selecionada
- **Data e Hora**: Data e hora agendadas para a inspeção
- **Contrato**: Contrato selecionado para o agendamento
- **Carta de Apresentação**: Carta de apresentação selecionada
- **Dados de Pagamento**: Método de pagamento, valor e status

## Processo de Agendamento

O processo de agendamento é dividido em 8 etapas:

1. **Informações do Cliente**: Selecionar um cliente existente ou cadastrar um novo
2. **Informações Gerais**: Endereço da propriedade, tipo de inspeção e data/hora
3. **Informações do Agente**: Dados do agente imobiliário (opcional)
4. **Informações da Propriedade**: Características da propriedade
5. **Contrato**: Selecionar ou criar um contrato
6. **Carta de Apresentação**: Adicionar uma carta de apresentação
7. **Pagamento**: Definir método de pagamento e valores
8. **Revisão**: Revisar todas as informações antes de finalizar

## Persistência dos Dados

O sistema salva automaticamente o progresso a cada etapa concluída:

- Ao avançar para a próxima etapa, os dados são salvos no banco de dados
- Se o usuário fechar o formulário e retornar mais tarde, o progresso será mantido
- Na etapa final, o agendamento é marcado como "agendado" (scheduled)

## Campos Obrigatórios

Os seguintes campos são obrigatórios para finalizar um agendamento:

- Nome do cliente
- Endereço da propriedade
- Tipo de inspeção
- Data e hora da inspeção

## Fluxo de Status

O agendamento segue o seguinte fluxo de status:

1. **Rascunho (draft)**: Durante o preenchimento do formulário
2. **Agendado (scheduled)**: Após a finalização do formulário
3. **Concluído (completed)**: Após a realização da inspeção
4. **Cancelado (cancelled)**: Se o agendamento for cancelado

## Pagamento

O sistema suporta os seguintes status de pagamento:

- **Pendente (pending)**: Pagamento ainda não recebido
- **Pago (paid)**: Pagamento recebido integralmente
- **Parcial (partial)**: Pagamento recebido parcialmente
- **Reembolsado (refunded)**: Pagamento reembolsado ao cliente

## Executando o Script SQL

Para criar a tabela de agendamentos no banco de dados, execute o script SQL localizado em:

```
src/app/api/sql/create_bookings_table.sql
```

Este script criará a tabela, índices e políticas de segurança necessárias.

## Tratamento de Erros Comuns

### Erro com UUID Vazios

Um erro comum no sistema é o envio de UUIDs vazios ao banco de dados, resultando em mensagens de erro como:

```
invalid input syntax for type uuid: ""
```

Este erro ocorre porque o PostgreSQL não aceita strings vazias como valores válidos para campos do tipo UUID.

#### Solução Implementada

Para resolver esse problema, implementamos as seguintes medidas:

1. **Verificação Prévia**: Antes de enviar os dados ao banco, verificamos se um cliente foi selecionado.

2. **Construção Seletiva do Objeto**: Em vez de enviar todos os campos e depois tentar remover os inválidos, construímos o objeto de dados adicionando apenas os campos UUID que realmente possuem valores:

```typescript
// Criar o objeto base com os dados obrigatórios
const bookingData: any = {
  property_address: currentFormData.generalInfo.inspectionAddress,
  // outros campos básicos...
}

// Adicionar campos UUID apenas se não forem vazios
if (currentFormData.clientInfo.id) {
  bookingData.client_id = currentFormData.clientInfo.id
}

if (currentFormData.agreement.selectedContract) {
  bookingData.contract_id = currentFormData.agreement.selectedContract
}
```

3. **Validação por Etapa**: Na primeira etapa (seleção de cliente), exigimos que um cliente seja selecionado antes de prosseguir:

```typescript
if (currentStep === 0 && !currentFormData.clientInfo.id) {
  toast.warning('Por favor, selecione um cliente para continuar')
  return false
}
```

Essas medidas garantem que apenas valores UUID válidos sejam enviados ao banco de dados. 