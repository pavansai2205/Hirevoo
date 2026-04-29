import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "./models/user.model.js";
import { Company } from "./models/company.model.js";
import { Job } from "./models/job.model.js";
import { Application } from "./models/application.model.js";
import connectDB from "./utils/db.js";

// Load env vars
dotenv.config({ path: "../.env" });

const seedDatabase = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB for seeding...");

        const passwordHash = await bcrypt.hash("password123", 10);
        
        const recruiter = new User({
            fullname: "Mock Recruiter",
            email: "mockrecruiter@example.com",
            phoneNumber: 1234567890,
            password: passwordHash,
            role: "recruiter"
        });
        await recruiter.save();
        console.log("Created Recruiter");

        const student = new User({
            fullname: "Mock Student",
            email: "mockstudent@example.com",
            phoneNumber: 9876543210,
            password: passwordHash,
            role: "student",
            profile: {
                skills: ["React", "Node.js", "MongoDB", "Express"],
                bio: "Enthusiastic fullstack developer looking for opportunities."
            }
        });
        await student.save();
        console.log("Created Student");

        const company1 = new Company({
            name: "Tech Innovators Inc. " + Date.now(), // To avoid uniqueness issues if run multiple times
            description: "Leading the future of technology.",
            website: "https://techinnovators.com",
            location: "San Francisco, CA",
            userId: recruiter._id
        });
        await company1.save();

        const company2 = new Company({
            name: "Data Driven Co " + Date.now(),
            description: "Making sense of data through AI.",
            location: "New York, NY",
            userId: recruiter._id
        });
        await company2.save();
        console.log("Created Companies");

        const job1 = new Job({
            title: "Frontend Developer",
            description: "Looking for an experienced React developer to build interactive UIs.",
            requirements: ["React", "JavaScript", "HTML/CSS"],
            salary: 120000,
            experienceLevel: 3,
            location: "Remote",
            jobType: "Full-time",
            position: 2,
            company: company1._id,
            created_by: recruiter._id
        });
        const job1Saved = await job1.save();

        const job2 = new Job({
            title: "Backend Engineer",
            description: "Build scalable Node.js APIs.",
            requirements: ["Node.js", "Express", "MongoDB", "AWS"],
            salary: 130000,
            experienceLevel: 4,
            location: "San Francisco, CA",
            jobType: "Full-time",
            position: 1,
            company: company1._id,
            created_by: recruiter._id
        });
        await job2.save();

        const job3 = new Job({
            title: "Data Scientist",
            description: "Analyze large datasets and build models.",
            requirements: ["Python", "SQL", "Machine Learning"],
            salary: 140000,
            experienceLevel: 2,
            location: "New York, NY",
            jobType: "Full-time",
            position: 1,
            company: company2._id,
            created_by: recruiter._id
        });
        await job3.save();
        console.log("Created Jobs");
        
        const application = new Application({
            job: job1Saved._id,
            applicant: student._id,
            status: "pending"
        });
        await application.save();
        
        job1Saved.applications.push(application._id);
        await job1Saved.save();
        console.log("Created Application");

        console.log("-----------------------------------------");
        console.log("Seeding completed successfully!");
        console.log("Recruiter Login -> Email: mockrecruiter@example.com | Pass: password123");
        console.log("Student Login   -> Email: mockstudent@example.com   | Pass: password123");
        console.log("-----------------------------------------");
        
        process.exit(0);

    } catch (error) {
        if(error.code === 11000) {
            console.log("Mock users or companies already exist in the database!");
            console.log("If you want fresh data, log in as mockrecruiter@example.com / password123 and post more jobs!");
            process.exit(0); // Soft exit since it just means it was already run
        } else {
            console.error("Seeding Error:", error);
            process.exit(1);
        }
    }
}

seedDatabase();
