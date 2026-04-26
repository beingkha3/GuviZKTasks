// Seed script for the "zen_class" demo database.
// This file creates example data: mentors, users, CodeKata stats,
// topics, attendance records, tasks, and company drive events.
// Run this script with: mongosh zen_class_mongodb.js


// Switch to (or create) the "zen_class" database.
use("zen_class");

// Remove any existing collections so the script can be run multiple times
// without causing duplicate data or conflicts.
db.users.drop();
db.codekata.drop();
db.attendance.drop();
db.topics.drop();
db.tasks.drop();
db.company_drives.drop();
db.mentors.drop();


// Sample data insertion (example/demo records)


// Create example mentor documents
const mentors = [
    { _id: ObjectId(), name: "Ravi Kumar", email: "ravi.mentor@example.com" },
    { _id: ObjectId(), name: "Priya Sharma", email: "priya.mentor@example.com" },
    { _id: ObjectId(), name: "Arun Mehta", email: "arun.mentor@example.com" }
];
db.mentors.insertMany(mentors);

// Create sample users and assign mentors.
// Note: the first mentor is intentionally given more than 15 mentees
// to demonstrate queries that find mentors with large mentee counts.
const users = Array.from({ length: 20 }, function (_, index) {
    return {
        _id: ObjectId(),
        name: "Student " + (index + 1),
        email: "student" + (index + 1) + "@example.com",
        batch: "B42WD",
        mentor_id: index < 16 ? mentors[0]._id : index < 18 ? mentors[1]._id : mentors[2]._id
    };
});
db.users.insertMany(users);

// Add CodeKata problem-solved statistics for each user
const problemsSolved = [120, 95, 140, 80, 160, 70, 110, 130, 60, 100, 115, 90, 150, 75, 105, 125, 85, 135, 55, 145];
db.codekata.insertMany(
    users.map(function (user, index) {
        return {
            user_id: user._id,
            problems_solved: problemsSolved[index]
        };
    })
);

// Create example topics with teaching dates
const topics = [
    { _id: ObjectId(), topic_name: "HTML Basics", taught_date: ISODate("2020-09-28") },
    { _id: ObjectId(), topic_name: "CSS Selectors", taught_date: ISODate("2020-10-05") },
    { _id: ObjectId(), topic_name: "JavaScript Basics", taught_date: ISODate("2020-10-10") },
    { _id: ObjectId(), topic_name: "DOM Manipulation", taught_date: ISODate("2020-10-16") },
    { _id: ObjectId(), topic_name: "Async JavaScript", taught_date: ISODate("2020-10-22") },
    { _id: ObjectId(), topic_name: "React Introduction", taught_date: ISODate("2020-10-29") },
    { _id: ObjectId(), topic_name: "Node.js Basics", taught_date: ISODate("2020-11-05") }
];
db.topics.insertMany(topics);

// Add attendance records for various users and topic dates
db.attendance.insertMany([
    { user_id: users[0]._id, topic_id: topics[3]._id, attendance_date: ISODate("2020-10-16"), status: "Absent" },
    { user_id: users[1]._id, topic_id: topics[3]._id, attendance_date: ISODate("2020-10-16"), status: "Present" },
    { user_id: users[2]._id, topic_id: topics[3]._id, attendance_date: ISODate("2020-10-16"), status: "Absent" },
    { user_id: users[3]._id, topic_id: topics[4]._id, attendance_date: ISODate("2020-10-22"), status: "Absent" },
    { user_id: users[4]._id, topic_id: topics[4]._id, attendance_date: ISODate("2020-10-22"), status: "Present" },
    { user_id: users[5]._id, topic_id: topics[4]._id, attendance_date: ISODate("2020-10-22"), status: "Absent" },
    { user_id: users[6]._id, topic_id: topics[5]._id, attendance_date: ISODate("2020-10-29"), status: "Absent" },
    { user_id: users[7]._id, topic_id: topics[5]._id, attendance_date: ISODate("2020-10-29"), status: "Present" },
    { user_id: users[8]._id, topic_id: topics[5]._id, attendance_date: ISODate("2020-10-29"), status: "Absent" },
    { user_id: users[9]._id, topic_id: topics[5]._id, attendance_date: ISODate("2020-10-29"), status: "Present" },
    { user_id: users[10]._id, topic_id: topics[1]._id, attendance_date: ISODate("2020-10-05"), status: "Present" },
    { user_id: users[11]._id, topic_id: topics[2]._id, attendance_date: ISODate("2020-10-10"), status: "Absent" },
    { user_id: users[12]._id, topic_id: topics[2]._id, attendance_date: ISODate("2020-10-10"), status: "Present" },
    { user_id: users[13]._id, topic_id: topics[3]._id, attendance_date: ISODate("2020-10-16"), status: "Absent" },
    { user_id: users[14]._id, topic_id: topics[4]._id, attendance_date: ISODate("2020-10-22"), status: "Present" }
]);

// Add task assignments and submission status for users
db.tasks.insertMany([
    { user_id: users[0]._id, topic_id: topics[3]._id, task_name: "DOM Task", assigned_date: ISODate("2020-10-16"), submitted_date: null, status: "Not Submitted" },
    { user_id: users[1]._id, topic_id: topics[3]._id, task_name: "DOM Task", assigned_date: ISODate("2020-10-16"), submitted_date: ISODate("2020-10-18"), status: "Submitted" },
    { user_id: users[2]._id, topic_id: topics[3]._id, task_name: "DOM Task", assigned_date: ISODate("2020-10-16"), submitted_date: null, status: "Not Submitted" },
    { user_id: users[3]._id, topic_id: topics[4]._id, task_name: "Promise Task", assigned_date: ISODate("2020-10-22"), submitted_date: null, status: "Not Submitted" },
    { user_id: users[4]._id, topic_id: topics[4]._id, task_name: "Promise Task", assigned_date: ISODate("2020-10-22"), submitted_date: ISODate("2020-10-24"), status: "Submitted" },
    { user_id: users[5]._id, topic_id: topics[4]._id, task_name: "Promise Task", assigned_date: ISODate("2020-10-22"), submitted_date: null, status: "Not Submitted" },
    { user_id: users[6]._id, topic_id: topics[5]._id, task_name: "React Component Task", assigned_date: ISODate("2020-10-29"), submitted_date: null, status: "Not Submitted" },
    { user_id: users[7]._id, topic_id: topics[5]._id, task_name: "React Component Task", assigned_date: ISODate("2020-10-29"), submitted_date: ISODate("2020-10-30"), status: "Submitted" },
    { user_id: users[8]._id, topic_id: topics[5]._id, task_name: "React Component Task", assigned_date: ISODate("2020-10-29"), submitted_date: null, status: "Not Submitted" },
    { user_id: users[9]._id, topic_id: topics[5]._id, task_name: "React Component Task", assigned_date: ISODate("2020-10-29"), submitted_date: ISODate("2020-10-31"), status: "Submitted" },
    { user_id: users[10]._id, topic_id: topics[1]._id, task_name: "CSS Task", assigned_date: ISODate("2020-10-05"), submitted_date: ISODate("2020-10-06"), status: "Submitted" },
    { user_id: users[11]._id, topic_id: topics[2]._id, task_name: "JavaScript Task", assigned_date: ISODate("2020-10-10"), submitted_date: null, status: "Not Submitted" },
    { user_id: users[12]._id, topic_id: topics[2]._id, task_name: "JavaScript Task", assigned_date: ISODate("2020-10-10"), submitted_date: ISODate("2020-10-11"), status: "Submitted" },
    { user_id: users[13]._id, topic_id: topics[3]._id, task_name: "DOM Task", assigned_date: ISODate("2020-10-16"), submitted_date: null, status: "Not Submitted" },
    { user_id: users[14]._id, topic_id: topics[4]._id, task_name: "Promise Task", assigned_date: ISODate("2020-10-22"), submitted_date: ISODate("2020-10-23"), status: "Submitted" }
]);

// Add company drive events.
// Each drive document embeds participating students and their appearance status.
db.company_drives.insertMany([
    {
        company_name: "Zoho",
        drive_date: ISODate("2020-10-10"),
        students: [
            { user_id: users[0]._id, status: "Appeared" },
            { user_id: users[1]._id, status: "Appeared" }
        ]
    },
    {
        company_name: "Amazon",
        drive_date: ISODate("2020-10-16"),
        students: [
            { user_id: users[2]._id, status: "Appeared" },
            { user_id: users[3]._id, status: "Not Appeared" },
            { user_id: users[4]._id, status: "Appeared" }
        ]
    },
    {
        company_name: "Freshworks",
        drive_date: ISODate("2020-10-20"),
        students: [
            { user_id: users[5]._id, status: "Appeared" },
            { user_id: users[6]._id, status: "Appeared" },
            { user_id: users[7]._id, status: "Not Appeared" }
        ]
    },
    {
        company_name: "TCS",
        drive_date: ISODate("2020-10-28"),
        students: [
            { user_id: users[8]._id, status: "Appeared" },
            { user_id: users[9]._id, status: "Appeared" },
            { user_id: users[10]._id, status: "Appeared" }
        ]
    },
    {
        company_name: "Infosys",
        drive_date: ISODate("2020-11-02"),
        students: [
            { user_id: users[11]._id, status: "Appeared" }
        ]
    }
]);

// Example reporting queries (answers to common exercises)


// Query 1: List topics taught in October and include the tasks related to them.
db.topics.aggregate([
    {
        $match: {
            taught_date: {
                $gte: ISODate("2020-10-01"),
                $lte: ISODate("2020-10-31T23:59:59.999Z")
            }
        }
    },
    {
        $lookup: {
            from: "tasks",
            localField: "_id",
            foreignField: "topic_id",
            as: "tasks"
        }
    },
    {
        $project: {
            _id: 0,
            topic_name: 1,
            taught_date: 1,
            tasks: {
                task_name: 1,
                assigned_date: 1,
                status: 1
            }
        }
    }
]);

// Query 2: Find company drives that took place between 15-Oct-2020 and 31-Oct-2020.
db.company_drives.find(
    {
        drive_date: {
            $gte: ISODate("2020-10-15"),
            $lte: ISODate("2020-10-31T23:59:59.999Z")
        }
    },
    {
        _id: 0,
        company_name: 1,
        drive_date: 1
    }
);

// Query 3: For each company drive, list students who 'Appeared' along with their names.
db.company_drives.aggregate([
    { $unwind: "$students" },
    { $match: { "students.status": "Appeared" } },
    {
        $lookup: {
            from: "users",
            localField: "students.user_id",
            foreignField: "_id",
            as: "student_details"
        }
    },
    { $unwind: "$student_details" },
    {
        $project: {
            _id: 0,
            company_name: 1,
            drive_date: 1,
            student_name: "$student_details.name",
            status: "$students.status"
        }
    }
]);

// Query 4: Report the number of CodeKata problems solved per user.
db.codekata.aggregate([
    {
        $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user_details"
        }
    },
    { $unwind: "$user_details" },
    {
        $project: {
            _id: 0,
            student_name: "$user_details.name",
            problems_solved: 1
        }
    }
]);

// Query 5: Find mentors who have more than 15 mentees.
db.users.aggregate([
    {
        $group: {
            _id: "$mentor_id",
            mentee_count: { $sum: 1 }
        }
    },
    {
        $match: {
            mentee_count: { $gt: 15 }
        }
    },
    {
        $lookup: {
            from: "mentors",
            localField: "_id",
            foreignField: "_id",
            as: "mentor_details"
        }
    },
    { $unwind: "$mentor_details" },
    {
        $project: {
            _id: 0,
            mentor_name: "$mentor_details.name",
            mentee_count: 1
        }
    }
]);

// Query 6: Count users who were absent and also did not submit their tasks
// between 15-Oct-2020 and 31-Oct-2020.
db.attendance.aggregate([
    {
        $match: {
            status: "Absent",
            attendance_date: {
                $gte: ISODate("2020-10-15"),
                $lte: ISODate("2020-10-31T23:59:59.999Z")
            }
        }
    },
    {
        $lookup: {
            from: "tasks",
            let: { attendance_user_id: "$user_id" },
            pipeline: [
                {
                    $match: {
                        $expr: { $eq: ["$user_id", "$$attendance_user_id"] },
                        status: "Not Submitted",
                        assigned_date: {
                            $gte: ISODate("2020-10-15"),
                            $lte: ISODate("2020-10-31T23:59:59.999Z")
                        }
                    }
                }
            ],
            as: "not_submitted_tasks"
        }
    },
    {
        $match: {
            not_submitted_tasks: { $ne: [] }
        }
    },
    {
        $group: {
            _id: "$user_id"
        }
    },
    {
        $count: "absent_and_task_not_submitted_count"
    }
]);
