# CONTRIBUTING GUIDELINES

Welcome to the team!

We use multiple environments to manage our code safely:

- `prod` → Live production code
- `dev` → Stable code that’s tested and ready to release
- `pre-dev` → New environment for all developers to test and work before merging to `dev`

## What You Should Do as a Developer

1. **Clone the project**
   Get the code to your local machine:

   ```
   git clone https://github.com/<your-org>/<repo>.git
   cd <repo>
   ```

2. **Create your own branch from `pre-dev`**
   Always start from the `pre-dev` branch.

   ```
   git checkout pre-dev
   git pull origin pre-dev
   git checkout -b feature/your-task-name
   ```

3. **Work on your changes and commit them**
   After making changes:

   ```
   git add .
   git commit -m "Your short message about what you did"
   ```

4. **Push your branch to GitHub**

   ```
   git push origin feature/your-task-name
   ```

5. **Create a Pull Request (PR)**
   Go to GitHub and open a pull request:

   - Base branch: `pre-dev`
   - Your branch: the one you just pushed (e.g., `feature/login-page`)
   - Add a short title and description
   - Assign someone to review

6. **After Review**
   Once the team reviews and approves your PR, it will be merged into `pre-dev`.
   Later, senior developers will move code from `pre-dev` → `dev` → `prod`.

## Rules to Follow

- ❌ Don’t push directly to `pre-dev`, `dev`, or `prod` branches.
- ✅ Always create a new branch from `pre-dev` and make a PR.
- 💬 Ask if you’re unsure about anything.

## Example Branch Flow

```
Your Branch → Pull Request → pre-dev → dev → prod
```
