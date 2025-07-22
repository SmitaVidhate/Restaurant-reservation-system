# Deployment Guide

## How to Push Your Code to GitHub

Since this project was created in a WebContainer environment, here's how to get your code into a Git repository:

### Method 1: Download and Push (Recommended)

1. **Download the project files**:
   - Use your browser's developer tools or the platform's download feature
   - Or copy all files manually to your local machine

2. **Initialize Git repository locally**:
```bash
# Navigate to your project directory
cd smita-restaurant-management-system

# Initialize git
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: Smita Restaurant Management System"
```

3. **Create GitHub repository**:
   - Go to [GitHub.com](https://github.com)
   - Click "New repository"
   - Name it `smita-restaurant-management-system`
   - Don't initialize with README (we already have one)

4. **Connect and push**:
```bash
# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/smita-restaurant-management-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Method 2: GitHub CLI (if you have it installed)

```bash
# Create repo and push in one go
gh repo create smita-restaurant-management-system --public --source=. --remote=origin --push
```

### Method 3: Using GitHub Desktop

1. Download GitHub Desktop
2. Clone or create new repository
3. Copy your project files into the repository folder
4. Commit and push through the GUI

## Continuous Deployment Setup

### Netlify (Current deployment)
- Your site is already deployed at: https://quiet-faun-16a2bd.netlify.app
- Connect your GitHub repo to Netlify for automatic deployments
- Build command: `npm run build`
- Publish directory: `dist`

### Vercel Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production
vercel --prod
```

### GitHub Pages Setup
1. Go to your repository settings
2. Navigate to "Pages" section
3. Select source: "GitHub Actions"
4. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## Environment Variables

For production deployment, set these environment variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics
VITE_GA_TRACKING_ID=your_google_analytics_id
```

## Database Setup (Production)

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note down your URL and anon key

2. **Run Database Migrations**:
   - Use the Supabase dashboard SQL editor
   - Or use the Supabase CLI

3. **Update Configuration**:
   - Replace mock data in `src/lib/supabase.ts`
   - Add your real Supabase credentials

## Post-Deployment Checklist

- [ ] Test all reservation flows
- [ ] Verify admin login functionality
- [ ] Check mobile responsiveness
- [ ] Test real-time updates
- [ ] Verify email notifications
- [ ] Check database connections
- [ ] Test concurrent booking scenarios
- [ ] Verify menu display and filtering
- [ ] Check all form validations
- [ ] Test error handling

## Monitoring and Analytics

Consider adding:
- Google Analytics for user tracking
- Sentry for error monitoring
- Supabase Analytics for database insights
- Netlify Analytics for deployment metrics

## Support

If you encounter issues during deployment:
1. Check the build logs
2. Verify all environment variables
3. Test locally first with `npm run build && npm run preview`
4. Check browser console for errors