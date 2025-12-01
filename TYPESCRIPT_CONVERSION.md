# TypeScript Conversion

This repository has been successfully converted from JavaScript to TypeScript.

## Conversion Summary

The conversion includes:

- **39 TypeScript files** created in the `src/` directory
- Full type safety with TypeScript interfaces and types
- Maintained backward compatibility with the original API
- Proper module exports and imports

## Project Structure

```
src/
├── api/               # API methods (close, exists, mkdir, readdir, etc.)
├── messages/          # SMB2 message handlers
├── structures/        # SMB2 protocol structures
├── tools/             # Utility functions and helpers
├── types/             # TypeScript type definitions
├── smb2.ts           # Main SMB2 class
└── index.ts          # Main export file
```

## Building the Project

To build the TypeScript project:

```bash
npm install
npm run build
```

This will compile TypeScript files from `src/` to JavaScript in `dist/`.

## Type Definitions

The package now includes full TypeScript type definitions. The main types are exported from `src/types/index.ts`:

- `SMB2Options` - Configuration options for SMB2 connections
- `SMB2Connection` - Connection interface
- `SMB2Callback` - Callback function type
- `ReadFileOptions` - Options for reading files
- `FileInfo` - File information structure

## API Changes

The API remains the same as the original JavaScript version. All methods are properly typed:

```typescript
import SMB2 from './smb2';

const smb2Client = new SMB2({
  share: '\\\\SERVER\\Share',
  domain: 'DOMAIN',
  username: 'username',
  password: 'password'
});

// All methods are now fully typed
smb2Client.readFile('path/to/file.txt', (err, data) => {
  // err and data are properly typed
});
```

## Migration Notes

1. The original JavaScript files remain in `lib/` for reference
2. All TypeScript source is in `src/`
3. Compiled JavaScript output goes to `dist/`
4. Type definitions are automatically generated during build

## Dependencies

The project now includes development dependencies:

- `typescript` - TypeScript compiler
- `@types/node` - Node.js type definitions

The runtime dependency `ntlm` remains unchanged.

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch mode for development
- `npm run prepare` - Automatically runs build before publishing

## Backward Compatibility

The compiled JavaScript in `dist/` maintains full backward compatibility with the original implementation. Existing JavaScript projects can continue using the package without any changes.
