# Pulling in Cursor skills from a private repo

Repo: `git@github.com:DLTKfrancesmunoz/cursor_skills.git`

## Option A: Personal skills (available in all projects)

Skills live in `~/.cursor/skills/`. To install from the repo:

```bash
# 1. Clone the repo (anywhere)
git clone git@github.com:DLTKfrancesmunoz/cursor_skills.git /tmp/cursor_skills

# 2. Ensure personal skills dir exists
mkdir -p ~/.cursor/skills

# 3. Copy skill folders from repo into personal skills
cp -R /tmp/cursor_skills/.cursor/skills/* ~/.cursor/skills/

# 4. Optional: remove clone
rm -rf /tmp/cursor_skills
```

After this, Cursor will load those skills in every project.

## Option B: Project-only skills (this repo only)

Skills live in this project at `.cursor/skills/`. To install:

```bash
# 1. Clone the repo (or add as submodule)
git clone git@github.com:DLTKfrancesmunoz/cursor_skills.git /tmp/cursor_skills

# 2. Ensure project skills dir exists
mkdir -p .cursor/skills

# 3. Copy skill folders into this project
cp -R /tmp/cursor_skills/.cursor/skills/* .cursor/skills/

# 4. Optional: remove clone
rm -rf /tmp/cursor_skills
```

## Private repo access

- **SSH** (recommended): Use the `git@github.com:...` URL. Ensure your SSH key is added to GitHub and `ssh -T git@github.com` works.
- **HTTPS**: If you use HTTPS, use a Personal Access Token instead of a password when prompted.

## Updating skills later

Re-run the same clone + copy steps, or add the repo as a git submodule and copy from the submodule path when you pull.
