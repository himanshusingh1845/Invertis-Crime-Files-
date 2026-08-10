const mongoose = require("mongoose");

require("dotenv").config();

const Case = require("./Models/case");


const cases = [

    {
        caseId: "CR001",
        title: "Sample Murder Case",
        category: "Murder",
        year: 2024,
        state: "Delhi",
        location: "New Delhi",
        summary: "This is a sample case for testing.",
        fullDetails: "Dummy information for testing the backend.",
        victim: "Publicly shareable test information",
        accused: "Public record test information",
        timeline: "Investigation started in 2024.",
        evidence: "Sample forensic evidence.",
        forensicAnalysis: "Sample forensic analysis.",
        courtVerdict: "Sample court verdict.",
        references: "Sample reference"
    },

    {
        caseId: "CR002",
        title: "Sample Theft Case",
        category: "Theft / Robbery",
        year: 2025,
        state: "Uttar Pradesh",
        location: "Lucknow",
        summary: "This is a sample theft case created for testing.",
        fullDetails: "Dummy information used to test MongoDB.",
        victim: "Publicly shareable test information",
        accused: "Public record test information",
        timeline: "The incident was reported in 2025.",
        evidence: "Sample CCTV footage.",
        forensicAnalysis: "Sample forensic analysis.",
        courtVerdict: "Sample court verdict.",
        references: "Sample reference"
    },

    {
        caseId: "CR003",
        title: "Sample Court Judgment",
        category: "Court Judgment",
        year: 2023,
        state: "Maharashtra",
        location: "Mumbai",
        summary: "Sample publicly available court judgment.",
        fullDetails: "Dummy court judgment information.",
        victim: "Public record information",
        accused: "Public record information",
        timeline: "Case proceedings took place in 2023.",
        evidence: "Documentary evidence.",
        forensicAnalysis: "Not applicable.",
        courtVerdict: "Sample judgment.",
        references: "Sample court reference"
    }

];


async function seedDatabase() {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB Connected"
        );


        await Case.deleteMany({});

        console.log(
            "Old cases removed"
        );


        await Case.insertMany(cases);

        console.log(
            "Cases inserted successfully"
        );


        await mongoose.disconnect();

        console.log(
            "MongoDB disconnected"
        );

    }

    catch (error) {

        console.error(
            "Database Error:",
            error
        );

    }

}


seedDatabase();