# Solana Dashboard

A modern, responsive dashboard for monitoring and managing Solana tokens and transactions.

## Features

- Real-time token monitoring
- Transaction history tracking
- Network status monitoring
- Wallet integration
- Offline support with PWA
- Mobile-responsive design

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Prerequisites

- Node.js >= 14
- npm >= 6
- A modern web browser
- Solana wallet (e.g., Phantom)

## Development Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/solana-dashboard.git
cd solana-dashboard
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Start development server
```bash
npm start
```

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- src/__tests__/components/TokenStats.test.js
```

## Deployment

### Production Build

```bash
npm run build
```

### Docker Deployment

```bash
# Build image
docker build -t solana-dashboard .

# Run container
docker run -p 3000:80 solana-dashboard
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| REACT_APP_RPC_ENDPOINT | Solana RPC endpoint | Yes |
| REACT_APP_NETWORK | Solana network (mainnet/devnet) | Yes |
| REACT_APP_SENTRY_DSN | Sentry DSN for error tracking | No |

## Architecture

The application follows a modern React architecture with:

- React 18 with Hooks
- Context for state management
- Component-based architecture
- Error boundaries for reliability
- PWA support for offline functionality
- TypeScript-like prop types
- Unit and integration tests

### Project Structure

```
src/
├── components/      # Reusable components
├── context/        # Context providers
├── hooks/          # Custom hooks
├── pages/          # Page components
├── utils/          # Utility functions
├── __tests__/      # Test files
└── styles/         # CSS and style files
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## Security

Please read [SECURITY.md](SECURITY.md) for our security policy.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
