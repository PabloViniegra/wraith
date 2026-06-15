Follow this order when implementing a task:

1. Create an issue on **Github** for the task.
2. Create a branch from this issue based on `main` and switch to it to work.
3. Ask the user if they want to use the `caveman` skill and in which mode `[lite | full | ultra]`. If yes, enable it for the entire workflow. If no, ignore it.
4. Use the `grill-with-docs` skill to interview the user and reach an agreement.
5. Use the `to-prd` skill to document the agreement reached.
6. Use the `to-issues` skill to break down the tasks.
7. If the task involves interfaces, pages, and components, use the `frontend-design`, `make-interfaces-feel-better` and `design-an-interface` skills.
8. Implement using the `tdd` and `ponytail` skills.
9. Review the implementation using the `react-19` and `typescript-advanced-types` skills.
10. If there are bugs, review them with the `diagnose` skill.
11. Once these steps are complete, the **user** is invited to test it.
12. If the user gives the **“OK”** commit and push the changes, closing the active issue. Finally, create a _pull request_.
