- always use pnpm
- TODO Guidelines, write the title in todo.md. keep task names short (≤ 30 words in one sentence) and put the details in `/todo/` folder

## Project Structure

```
magi/
├── frontend/          # Next.js frontend application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── ...           # Next.js config files
├── todo/             # Detailed task documentation
├── .git/             # Git repository
└── *.md              # Project documentation
```

## Development

To run the frontend development server:
```bash
cd frontend
pnpm dev
```
