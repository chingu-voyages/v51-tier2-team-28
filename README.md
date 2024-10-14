# Expense Splitter

![Screenshot](expense-splitter/expense-splitter.png)

## Overview:

This app was created to have a convenient way to split the bill between a group of friends. With a focus on smooth UX, we've designed our app to feel intuitive for the user to use and understand.

## Features

**<u>Friends:</u>**
Get started by adding friends. Add a friend to your friends list for expense group creation purposes. Friends have names and emails and can be removed or edited. Friends cannot be removed if connected to a group or expense.

**<u>Expense Group Management:</u>**
After adding the friends you want for a group, you may now create an expense group. Create a group with a group name, description, budget, and friends. Individual groups keep track of progress for how much of the group's budget has been spent in expenses. Group details include a pie chart of how much of the budget was spent for each expense category. Once an expense group is created, you may now create expenses for the group.

**<u>Expense Management:</u>**
Create an expense with details such as; name, description, category, amount, and group. When a group is selected, the friends will automatically populate with default weight contributions of 0. If any members have a value of 0, the remaining weight will be distributed evenly amongst them. (For example: if one group member's contribution is 40% and the remaining 2 friends have a 0% contribution, the app will calculate a 30% distribution for each of the 2 remaining friends.) The contribution is converted to a dollar amount and displayed on the create expense form. Once an expense is created, you may now see the expense under the expenses tab. Expense details contain information for the expense name, cost, category, description, a pie chart with distributions, group associated with expense, expense members and contributions, and a receipt as downloadable PDF.

**<u>Analytics:</u>**
Our pie charts provide a visual breakdown of expenses by _Friend_ in the _Expense_ view and by _Category_ in the _Group_ view. The progress bar makes it easy to see at first glance, how close everyone is to balance out their accounts.

**<u>Edit:</u>**
Don't have all the info at once? Feel free to _Create Your Expense_ and go back to _Edit_ it anytime. Your saved expense information will dynamically update, including the new total amounts each friend owes.

**<u>Receipt Upload:</u>**
For easier reference, share the receipt in your group with our _Upload_ feature.

**<u>User Interface:</u>**
Our app is easy to navigate and limits clicks needed to reach destinations. When viewing a group, you may simply click an expense to view the details of the associated expense. When viewing an expense, you may simply click on the group name to view the associated group. Our Nav Bar is accessible on every page. Our delete and edit buttons for a group and expense are fixed on screen in order to prevent the user from unnecessary scrolling.

**<u>Filtered View Tabs:</u>**
View relevant information by tab for: _Group_, _Friend_, and _Expense_ to focus on what you specifically want access to.

**<u>Summary:</u>**
Our homepage offers a consolidated view of the top three recent activities for _Groups_ and \*Expenses.

**<u>Search:</u>**
An easy to use search bar is accessible on each tab to search for your group, friend, and/or individual expense.

## Running the Project

1. Clone this project locally
2. cd into the project directory
3. cd into expense-splitter
4. To run the app on your local device, make sure to install the appropriate packages and run using the following command:

```sh
npm install
npm run dev
```

5. Get started adding your **Friend**, creating your _Group_, and creating your **Expense**

## Dependencies

React, Tailwind, React Hook Forms, Firebase, html2pdf, Local Storage DB, Zod, Nanoid, MUI, Font Awesome.

## Deployed

[https://expensesplittermain.netlify.app/](https://expensesplittermain.netlify.app/)

## Meet the Creators

- Kristi Hwang (Developer): [GitHub](https://github.com/kristi-h) / [LinkedIn](https://www.linkedin.com/in/kristi-h-4542b38a/)
- Carlos Cespedes (Developer): [GitHub](https://github.com/ccespedes) / [LinkedIn](https://linkedin.com/in/account)
- Abel Sila (Developer): [GitHub](https://github.com/belunatic) / [LinkedIn](https://www.linkedin.com/in/abel-sila-24b4a97a/)
- Matthew Neie (Developer): [GitHub](https://github.com/MatthewNeie) / [LinkedIn](https://linkedin.com/in/matthew-neie)
- Alex Singh (Developer): [GitHub](https://github.com/singhalex) / [LinkedIn](https://www.linkedin.com/in/kaur-singh-748000254/)
- Bolaji (Product Owner): [GitHub](https://github.com/Anuoluwatobi) / [LinkedIn](https://www.linkedin.com/in/anuoluwatobi-majesty-bolaji-734583237/)
- Smiti Mishra (Scrum Master): [GitHub](https://github.com/SM171906) / [LinkedIn](https://www.linkedin.com/in/smitimishra/)
- Abby Nyhof (UX Designer): [GitHub](https://github.com/abbynyhof) / [LinkedIn](https://www.linkedin.com/in/abbynyhof/)

## Special Thanks

Special thanks to Carlos Cespedes and Alex Singh for leading the development team.  
Special thanks to Chingu for organizing this project.
