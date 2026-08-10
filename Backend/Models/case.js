const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({

    caseId: {
        type: String,
        required: true,
        unique: true
    },

    title: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    caseType: {
        type: String,
        enum: ["National", "International"],
        required: true
    },

    trending: {
        type: Boolean,
        default: false
    },

    year: {
        type: Number,
        required: true
    },

    state: {
        type: String,
        required: true
    },

    location: {
        type: String
    },

    summary: {
        type: String
    },

    fullDetails: {
        type: String
    },

    victim: {
        type: String
    },

    accused: {
        type: String
    },

    timeline: {
        type: String
    },

    evidence: {
        type: String
    },

    forensicAnalysis: {
        type: String
    },

    courtVerdict: {
        type: String
    },

    references: {
        type: String
    }

});

const Case = mongoose.model("Case", caseSchema);

module.exports = Case;