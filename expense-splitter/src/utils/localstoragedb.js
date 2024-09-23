import localStorageDB from "localstoragedb";
import {
  dummyExpenses,
  dummyFriends,
  dummyGroups,
  dummyUser,
  expensesSchema,
  friendsSchema,
  groupSchema,
  userSchema,
} from "./dummyData";

// -- VIEW DOCS: https://github.com/knadh/localStorageDB --//

// Create db in local storage if none exists
const db = new localStorageDB("database", localStorage);

// Initialize the database if empty
if (db.isNew()) {
  db.createTable("friends", friendsSchema);
  db.createTable("expenses", expensesSchema);
  db.createTable("groups", groupSchema);
  db.createTable("user", userSchema);

  //Populate the tables
  dummyFriends.forEach((friend) => {
    db.insert("friends", friend);
  });
  dummyExpenses.forEach((expenses) => {
    db.insert("expenses", expenses);
  });
  dummyGroups.forEach((group) => {
    db.insert("groups", group);
  });
  // dummyUser.forEach((user) => {
  //   db.insert("user", user);
  // });

  // Write db to localstorage
  db.commit();
}

export default db;
