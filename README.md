# Stay Deployable

A website project ready for development and deployment.

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Locally

```bash
npm start
```

This will start a local development server. Open your browser to the URL shown in the terminal (typically `http://localhost:3000`).

## Git Setup

### Initial Setup (if not already done)

```bash
git init
git add .
git commit -m "Initial commit"
```

### Connect to GitHub

1. Create a new repository on GitHub
2. Add the remote:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

3. Push to GitHub:

```bash
git branch -M main
git push -u origin main
```

### Daily Workflow

```bash
# Pull latest changes
git pull

# Make your changes, then:
git add .
git commit -m "Your commit message"
git push
```

## Project Structure

- `index.html` - Main HTML file
- `styles.css` - Stylesheet
- `script.js` - JavaScript file
- `package.json` - NPM configuration and scripts
