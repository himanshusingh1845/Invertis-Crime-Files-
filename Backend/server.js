const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;


// ==================================================
// CORS
// ==================================================

app.use(cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://invertis-crime-files.onrender.com"
    ],
    methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS"
    ],
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization"
    ]
}));

// ==================================================
// JSON
// ==================================================

app.use(express.json());


// ==================================================
// DATABASE + SERVER START
// ==================================================

async function startServer() {

    try {

        // Connect to MongoDB FIRST

        await mongoose.connect(
            process.env.MONGO_URI
        );


        console.log(
            "MongoDB Connected Successfully"
        );

        console.log(
            "Database:",
            mongoose.connection.name
        );

        console.log(
            "Connection State:",
            mongoose.connection.readyState
        );


        // ==================================================
        // LOAD CASE MODEL AFTER DATABASE CONNECTION
        // ==================================================

        const Case = require("./Models/case");


        console.log(
            "Case model loaded:",
            Case.modelName
        );

        console.log(
            "Case collection:",
            Case.collection.name
        );

        console.log(
            "Case model connection:",
            Case.db.name
        );

        console.log(
            "Case model connection state:",
            Case.db.readyState
        );


        // ==================================================
        // TEST ROUTE
        // ==================================================

        app.get("/test", (req, res) => {

            res.json({

                message:
                    "Backend is working",

                database:
                    mongoose.connection.name,

                connectionState:
                    mongoose.connection.readyState

            });

        });


        // ==================================================
        // ADMIN LOGIN
        // ==================================================

        app.post(
            "/api/login",
            async (req, res) => {

                try {

                    const {
                        username,
                        password
                    } = req.body;


                    if (
                        username !==
                        process.env.ADMIN_USERNAME
                    ) {

                        return res.status(401).json({

                            message:
                                "Invalid username or password"

                        });

                    }


                    if (
                        password !==
                        process.env.ADMIN_PASSWORD
                    ) {

                        return res.status(401).json({

                            message:
                                "Invalid username or password"

                        });

                    }


                    const token =
                        jwt.sign(

                            {
                                username:
                                    username,

                                role:
                                    "admin"
                            },

                            process.env.JWT_SECRET,

                            {
                                expiresIn:
                                    "8h"
                            }

                        );


                    res.status(200).json({

                        message:
                            "Login successful",

                        token:
                            token

                    });

                }

                catch (error) {

                    console.error(
                        "Login error:",
                        error
                    );

                    res.status(500).json({

                        message:
                            "Server error during login"

                    });

                }

            }
        );


        // ==================================================
        // AUTHENTICATION MIDDLEWARE
        // ==================================================

        function authenticateAdmin(
            req,
            res,
            next
        ) {

            try {

                const authHeader =
                    req.headers.authorization;


                if (!authHeader) {

                    return res.status(401).json({

                        message:
                            "Authentication required"

                    });

                }


                const token =
                    authHeader.split(" ")[1];


                if (!token) {

                    return res.status(401).json({

                        message:
                            "Invalid authentication token"

                    });

                }


                const decoded =
                    jwt.verify(
                        token,
                        process.env.JWT_SECRET
                    );


                if (
                    decoded.role !== "admin"
                ) {

                    return res.status(403).json({

                        message:
                            "Admin access required"

                    });

                }


                req.admin = decoded;

                next();

            }

            catch (error) {

                return res.status(401).json({

                    message:
                        "Invalid or expired token"

                });

            }

        }


        // ==================================================
        // GET ALL CASES
        // ==================================================

app.get(
    "/api/cases",
    async (req, res) => {

        try {

            console.log("Getting cases...");

            console.log(
                "Mongoose state:",
                Case.db.readyState
            );

            console.log(
                "Mongoose database:",
                Case.db.name
            );


            const nativeCollection =
                mongoose.connection.db.collection(
                    "cases"
                );


            const cases =
                await nativeCollection
                    .find({})
                    .toArray();


            console.log(
                "Native MongoDB cases found:",
                cases.length
            );


            res.status(200).json(
                cases
            );

        }

        catch (error) {

            console.error(
                "Error getting cases:",
                error
            );


            res.status(500).json({

                message:
                    "Error getting cases",

                error:
                    error.message

            });

        }

    }
);

        // ==================================================
        // GET TRENDING CASES
        // ==================================================

        app.get(
            "/api/cases/trending",
            async (req, res) => {

                try {

                    const cases =
                        await Case.find({

                            trending: true

                        });


                    res.status(200).json(
                        cases
                    );

                }

                catch (error) {

                    console.error(
                        "Error getting trending cases:",
                        error
                    );

                    res.status(500).json({

                        message:
                            "Error getting trending cases",

                        error:
                            error.message

                    });

                }

            }
        );


        // ==================================================
        // GET ONE CASE
        // ==================================================

        app.get(
            "/api/cases/:id",
            async (req, res) => {

                try {

                    const foundCase =
                        await Case.findOne({

                            caseId:
                                req.params.id

                        });


                    if (!foundCase) {

                        return res.status(404).json({

                            message:
                                "Case not found"

                        });

                    }


                    res.status(200).json(
                        foundCase
                    );

                }

                catch (error) {

                    console.error(
                        "Error getting case:",
                        error
                    );

                    res.status(500).json({

                        message:
                            "Error getting case",

                        error:
                            error.message

                    });

                }

            }
        );


        // ==================================================
        // ADD CASE
        // ADMIN ONLY
        // ==================================================

        app.post(
            "/api/cases",
            authenticateAdmin,
            async (req, res) => {

                try {

                    const newCase =
                        new Case(req.body);


                    const savedCase =
                        await newCase.save();


                    res.status(201).json({

                        message:
                            "Case added successfully",

                        case:
                            savedCase

                    });

                }

                catch (error) {

                    console.error(
                        "Error adding case:",
                        error
                    );

                    res.status(400).json({

                        message:
                            "Error adding case",

                        error:
                            error.message

                    });

                }

            }
        );


        // ==================================================
        // UPDATE CASE
        // ADMIN ONLY
        // ==================================================

        app.put(
            "/api/cases/:id",
            authenticateAdmin,
            async (req, res) => {

                try {

                    const updatedCase =
                        await Case.findOneAndUpdate(

                            {
                                caseId:
                                    req.params.id
                            },

                            req.body,

                            {
                                new: true,
                                runValidators: true
                            }

                        );


                    if (!updatedCase) {

                        return res.status(404).json({

                            message:
                                "Case not found"

                        });

                    }


                    res.status(200).json({

                        message:
                            "Case updated successfully",

                        case:
                            updatedCase

                    });

                }

                catch (error) {

                    console.error(
                        "Error updating case:",
                        error
                    );

                    res.status(400).json({

                        message:
                            "Error updating case",

                        error:
                            error.message

                    });

                }

            }
        );


        // ==================================================
        // DELETE CASE
        // ADMIN ONLY
        // ==================================================

        app.delete(
            "/api/cases/:id",
            authenticateAdmin,
            async (req, res) => {

                try {

                    const deletedCase =
                        await Case.findOneAndDelete({

                            caseId:
                                req.params.id

                        });


                    if (!deletedCase) {

                        return res.status(404).json({

                            message:
                                "Case not found"

                        });

                    }


                    res.status(200).json({

                        message:
                            "Case deleted successfully",

                        case:
                            deletedCase

                    });

                }

                catch (error) {

                    console.error(
                        "Error deleting case:",
                        error
                    );

                    res.status(500).json({

                        message:
                            "Error deleting case",

                        error:
                            error.message

                    });

                }

            }
        );


        // ==================================================
        // START SERVER ONLY AFTER MONGODB CONNECTS
        // ==================================================

        app.listen(
            PORT,
            () => {

                console.log(
                    `Server running on http://localhost:${PORT}`
                );

            }
        );

    }

    catch (error) {

        console.error(
            "MongoDB Connection Error:"
        );

        console.error(error);

        process.exit(1);

    }

}


// ==================================================
// START APPLICATION
// ==================================================

startServer();