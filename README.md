# bauhiniaApp

Starting working on new automation script will be aligned with corresponding ticket inside board.
---

---

Add new branch:

git command: `git checkout -b "your-branch-name"`

 
After writing your changes:

           - git add .
           - git commit -m "commit message"
           - git push origin <your-branch-name>

When code review done => resolve comments

 Rebase branch with master and resolve conflicts (if any)


git commands:

          - git checkout main

          - git pull --rebase origin main

          - git checkout <your-branch>
          
          - git rebase main 

In order to publish your changes in the main repository create new pull request. (See the issue on github repository)
<<<<<<< HEAD

=======
 
>>>>>>> update: README.md
Before you start working on the project
---

First, clear all catched files:
- `npx rimraf node_modules packages/*/node_modules` 

Then install all packages and depandencies:
- `npm i` 
- `npm install`

Run the project
---

- `npm run build` - build project
- `npm run tests` or `npm test` - run tests

In the case the .js files stop being generated after build, run the following command before building:
- `npm run clean`


