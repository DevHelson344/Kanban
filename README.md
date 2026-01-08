# Calendário Simples

Um sistema de calendário minimalista focado apenas na funcionalidade de agendamentos.

## Funcionalidades

- ✅ Visualização de calendário mensal
- ✅ Agendamentos com status (pendente, aprovado, rejeitado)
- ✅ Painel lateral com detalhes dos agendamentos
- ✅ Estatísticas básicas
- ✅ Interface responsiva

## Tecnologias

- React 19
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (ícones)

## Como executar

1. Instalar dependências:
```bash
npm install
```

2. Executar em modo desenvolvimento:
```bash
npm run dev
```

3. Build para produção:
```bash
npm run build
```

## Estrutura do projeto

```
src/
├── components/          # Componentes React
│   ├── CalendarScheduler.tsx
│   └── BookingDetailsPanel.tsx
├── hooks/              # Hooks customizados
│   └── useCalendarData.ts
├── lib/                # Utilitários
│   └── utils.ts
├── App.tsx             # Componente principal
├── main.tsx            # Entrada da aplicação
└── index.css           # Estilos globais
```

## Personalização

Para adicionar novos agendamentos, modifique o objeto `mockBookings` no arquivo `App.tsx` ou integre com uma API externa através do hook `useCalendarData`.