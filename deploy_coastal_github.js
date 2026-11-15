const { execSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PAT = fs.readFileSync('C:/Users/dasan/.gemini/antigravity/scratch/cloudempire_new_pat.txt', 'utf8').trim();
const ORG = 'cloudempireTech';
const REPO = 'coastal-makers';
const WORK_DIR = 'C:/Users/dasan/.gemini/antigravity/scratch/coastal-makers';

function makeGithubRequest(method, apiPath, body = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const req = https.request({
      hostname: 'api.github.com',
      path: apiPath,
      method: method,
      headers: {
        'User-Agent': 'Cloudempire-Automation-Engine',
        'Authorization': `token ${PAT}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function main() {
  console.log(`Checking / creating repository ${ORG}/${REPO}...`);
  const checkRes = await makeGithubRequest('GET', `/repos/${ORG}/${REPO}`);
  
  if (checkRes.status === 404) {
    console.log(`Repo does not exist. Creating ${ORG}/${REPO}...`);
    const createRes = await makeGithubRequest('POST', `/user/repos`, {
      name: REPO,
      description: 'Coastal Makers | Custom 3D Printed Décor & Rapid Prototyping Sydney',
      private: false,
      has_issues: true,
      has_projects: true,
      has_wiki: false,
      auto_init: false
    });
    console.log('Create Repo Status:', createRes.status);
  } else {
    console.log(`Repo ${ORG}/${REPO} already exists.`);
  }

  // Initialize git & push
  console.log('Initializing git repository in work directory...');
  execSync('git init', { cwd: WORK_DIR, stdio: 'inherit' });
  execSync('git checkout -B main', { cwd: WORK_DIR, stdio: 'inherit' });
  execSync('git config user.name "Cloudempire Automation"', { cwd: WORK_DIR, stdio: 'inherit' });
  execSync('git config user.email "cloudempire.ai@gmail.com"', { cwd: WORK_DIR, stdio: 'inherit' });
  
  // Set remote
  const remoteUrl = `https://x-access-token:${PAT}@github.com/${ORG}/${REPO}.git`;
  try {
    execSync('git remote remove origin', { cwd: WORK_DIR, stdio: 'ignore' });
  } catch (e) {}
  execSync(`git remote add origin ${remoteUrl}`, { cwd: WORK_DIR, stdio: 'inherit' });

  // Add all files & commit
  execSync('git add -A', { cwd: WORK_DIR, stdio: 'inherit' });
  try {
    execSync('git commit -m "Deploy Coastal Makers bespoke website with hero video, interactive estimator, and multi-page showcase"', { cwd: WORK_DIR, stdio: 'inherit' });
  } catch (e) {
    console.log('Nothing to commit or already committed.');
  }

  console.log('Pushing to GitHub main branch...');
  execSync('git push -u origin main --force', { cwd: WORK_DIR, stdio: 'inherit' });

  // Enable Pages
  console.log('Enabling / verifying GitHub Pages...');
  const pagesRes = await makeGithubRequest('POST', `/repos/${ORG}/${REPO}/pages`, {
    source: {
      branch: 'main',
      path: '/'
    }
  });
  console.log('Pages Enable Status:', pagesRes.status);

  // Poll for live URL
  const targetUrl = `https://${ORG.toLowerCase()}.github.io/${REPO}/index.html`;
  console.log(`Polling live URL: ${targetUrl}...`);

  for (let attempt = 1; attempt <= 20; attempt++) {
    await new Promise(r => setTimeout(r, 6000));
    try {
      const liveCheck = await new Promise((resCheck) => {
        https.get(targetUrl, (res) => {
          resCheck(res.statusCode);
        }).on('error', () => resCheck(null));
      });
      console.log(`[Attempt ${attempt}/20] Status: ${liveCheck}`);
      if (liveCheck === 200) {
        console.log(`SUCCESS! Site is live at ${targetUrl}`);
        process.exit(0);
      }
    } catch (e) {}
  }

  console.log('Warning: Pages is propagating. URL will be active shortly:', targetUrl);
}

main().catch(err => {
  console.error('Deployment error:', err);
  process.exit(1);
});
