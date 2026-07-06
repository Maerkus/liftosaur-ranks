# Project Structure

```
src/
├── components/     # Preact UI components
├── models/        # Business logic & data models
├── pages/         # Page components
├── ducks/         # Redux-like state management
├── utils/         # Utilities
└── api/           # API service layer

lambda/            # Backend Lambda functions
├── dao/           # DynamoDB access
└── utils/         # Backend utilities
```

# Important Files
- `src/types.ts` - Core TypeScript types
- `src/models/state.ts` - Global state definition
- `src/parser.ts` - Liftoscript parser
- `lambda/index.ts` - Lambda router entry point
