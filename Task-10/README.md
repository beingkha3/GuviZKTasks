# Zen Class Programme MongoDB Database Task

This repository contains a MongoDB database design for a Zen class programme.

## Database Name

```js
zen_class
```

## Files Included

- `zen_class_mongodb.js` - Contains database creation/selection, collection setup, sample data insertion, and all required MongoDB queries.

## Collections Created

The database includes the following collections:

1. `users`
2. `codekata`
3. `attendance`
4. `topics`
5. `tasks`
6. `company_drives`
7. `mentors`

## Design Note

The company drive student participation is embedded inside the `company_drives` collection using a `students` array.

Example:

```js
{
  company_name: "Amazon",
  drive_date: ISODate("2020-10-16"),
  students: [
    { user_id: ObjectId("..."), status: "Appeared" },
    { user_id: ObjectId("..."), status: "Not Appeared" }
  ]
}
```

This keeps the design close to the collection names mentioned in the task.

## Features Covered

- Create/use database named `zen_class`
- Create collections for users, CodeKata, attendance, topics, tasks, company drives, and mentors
- Insert sample data
- Use references between collections using `ObjectId`
- Find topics and tasks taught in October
- Find company drives between 15-Oct-2020 and 31-Oct-2020
- Find company drives and students who appeared for placement
- Find number of CodeKata problems solved by each user
- Find mentors with more than 15 mentees
- Find number of users who were absent and did not submit tasks between 15-Oct-2020 and 31-Oct-2020

## How to Run

### Option 1: Run directly with mongosh

```bash
mongosh zen_class_mongodb.js
```

### Option 2: Paste into MongoDB Shell

1. Open MongoDB Shell.
2. Copy and paste the contents of `zen_class_mongodb.js`.
3. Run the script.

## Required Queries Included

All required queries are written at the bottom of the `zen_class_mongodb.js` file under the section:

```js
// REQUIRED QUERIES
```

## Notes

The script includes:

- `use("zen_class")`
- Drop collection commands so the script can be safely re-run
- Clear comments explaining each section and query
- MongoDB aggregation queries using `$lookup`, `$match`, `$group`, `$project`, and `$unwind`
- Sample data from October 2020 for testing the required queries
