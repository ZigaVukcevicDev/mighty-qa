# Mighty QA

Automated end-to-end test for **MightyFields** platform using [Playwright](https://playwright.dev/).

## Project overview

This project demonstrates a realistic, automation scenario for testing a form workflow in the MightyFields web app.  
It covers the complete process from login to case creation and closure.

## Features

- Login with credentials from `.env`
- Page-object login logic (`utils/login.ts`)
- Case creation from template `SimpleTestForm`
- Screenshots and video capture on failure

## Tech stack

- [Playwright](https://playwright.dev/)
- TypeScript
- Dotenv for secrets

## Setup instructions

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run tests
npm test

# Debug tests
npm run debug
```

Make sure to see `env.template` file for instructions how to handle credentials.

## Structure

```
mighty-fields/
├── tests/                          # All test specs files
│   └── mighty-fields.spec.ts
├── utils/                          # Page object and utility files
│   └── dismiss-cookie-banner.ts
│   └── login.ts
├── .env                            # Login credentials (not tracked)
└── ...                             # Other configs
```

## Author

Prepared by **Žiga Vukčevič** as a demonstration task.
