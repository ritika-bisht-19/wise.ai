# Root Directory Cleanup

Here is exactly how you clean up the project root to make it look professional and organized:

### 1. Move Scripts to a `scripts/` Folder
Currently, your root directory contains startup and environment scripts which clutters the workspace.
- **Action**: Create a `scripts/` directory at the root and move `.sh` and `.bat` files into it.
- **Command**:
```bash
mkdir scripts
mv run-mac.sh run-windows.bat scripts/
```
*(Note: Be sure to update internal paths inside those scripts from `cd frontend` to `cd ../frontend`, etc., since they are now one level deeper.)*

### 2. Clean Up Logs
Stray `.logs` directories or `*.log` files are created during testing/crashes.
- **Action**: Delete old log artifacts.
- **Command**:
```bash
rm -rf .logs *.log
```

### 3. Setting Up the `.gitignore`
Ensure generated files and sensitive data (like `.env` files) never reach GitHub.
- **Action**: Verify the root `.gitignore` contains the following:
```text
node_modules/
dist/
dist-ssr/
*.local
.DS_Store
*.log
.logs/
.vscode/
.idea/
.vite/
.env
speech_api/venv/
ai-services/face_api/.venv/
ai-services/face_api/.venv311/
```

---

# Frontend Architecture: Switching to `app/` Structure

Right now, your React `frontend/src` directory is slightly flat ("messy code"). To scale cleanly, you should refactor it into an `app/` architecture. 

### Why this structure?
It explicitly separates cross-cutting logic (`_shared` and `_lib`) from isolated feature code (`_features`).

### How to Switch:

**Current structure:**
```text
src/
├── components/
├── features/
├── hooks/
├── models/
├── pages/
├── router/
└── ...
```

**Proposed clean structure:**
```text
src/
└── app/
    ├── _features/      # Domain-specific logic, components, and state (e.g., /interview, /upload, /feedback)
    ├── _shared/        # Reusable UI components (Navbar, Buttons), hooks, and context
    └── _lib/           # Third-party wrappers, API clients, utility functions, algorithms
```

### Step-by-Step Refactor:
1. **Create the directories:**
   ```bash
   mkdir -p frontend/src/app/{_features,_shared,_lib}
   ```
2. **Move feature modules:** Move `src/features/interview` to `src/app/_features/interview`.
3. **Move shared components:** Move `src/components/*` to `src/app/_shared/components/`.
4. **Move hooks:** Move `src/hooks/*` to `src/app/_shared/hooks/`.
5. **Move utilities/models:** Move `src/models/*` or generic utility functions to `src/app/_lib/`.
6. **Update Imports:** Bulk-update your imports across your `.jsx/.tsx` files. Since you use Vite, you can set up `tsconfig.json` paths (e.g., `@/app/_features/...`) to make importing even cleaner.
