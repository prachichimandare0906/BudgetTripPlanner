const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


// ======================================================
// HOME
// ======================================================

app.get("/", (req, res) => {
    res.send(`
        <h1>Budget Trip Planner Backend</h1>
        <p>Node.js Server is running successfully.</p>
        <p>C++ Dynamic Programming: READY ✅</p>
    `);
});


// ======================================================
// CREATE INPUT FOR C++
// ======================================================

function createCppInput(data) {

    let input = "";

    input += `${data.budget}\n`;
    input += `${data.people}\n`;
    input += `${data.days}\n`;
    input += `${data.destinations.length}\n`;

    data.destinations.forEach(destination => {

        input += `${destination.name}\n`;
        input += `${destination.travelCost}\n`;
        input += `${destination.hotelCost}\n`;
        input += `${destination.roomCapacity}\n`;

        input += `${destination.activities.length}\n`;

        destination.activities.forEach(activity => {
            input += `${activity.name}\n`;
            input += `${activity.cost}\n`;
        });
    });

    return input;
}


// ======================================================
// PARSE COST
// ======================================================

function parseCost(text, label) {

    const regex = new RegExp(
        label +
        "\\s*:\\s*(?:Rs\\.?|₹)\\s*([\\d,]+)",
        "i"
    );

    const match = text.match(regex);

    if (!match) {
        return 0;
    }

    return parseInt(
        match[1].replace(/,/g, ""),
        10
    );
}


// ======================================================
// PARSE LIST
// ======================================================

function parseListBetween(
    text,
    startLabel,
    endLabel
) {

    const startRegex = new RegExp(
        startLabel.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        ),
        "i"
    );

    const endRegex = new RegExp(
        endLabel.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        ),
        "i"
    );

    const start = text.search(startRegex);

    if (start === -1) {
        return [];
    }

    let section =
        text.substring(
            start + startLabel.length
        );

    const end =
        section.search(endRegex);

    if (end !== -1) {
        section =
            section.substring(0, end);
    }

    return section
        .split(/\r?\n/)
        .map(line => line.trim())
        .map(line =>
            line.replace(/^[-•*]\s*/, "")
        )
        .filter(line =>
            line.length > 0
        );
}


// ======================================================
// PARSE BEST PLAN
// ======================================================

function parseBestPlan(
    output,
    budget,
    inputDestinations
) {

    const bestPlan = {

        destinations: [],
        activities: [],

        travelCost: 0,
        hotelCost: 0,
        activityCost: 0,

        totalCost: 0,
        total: 0,

        budget: Number(budget),

        status: "UNKNOWN"
    };


    if (!output) {
        return bestPlan;
    }


    // Find BEST PLAN section

    const bestMatch =
        output.match(
            /BEST\s+PLAN[\s\S]*$/i
        );

    if (!bestMatch) {
        return bestPlan;
    }


    const section =
        bestMatch[0];


    // Costs

    bestPlan.travelCost =
        parseCost(
            section,
            "Travel Cost"
        );

    bestPlan.hotelCost =
        parseCost(
            section,
            "Hotel Cost"
        );

    bestPlan.activityCost =
        parseCost(
            section,
            "Activity Cost"
        );

    bestPlan.totalCost =
        parseCost(
            section,
            "Total Cost"
        );

    bestPlan.total =
        bestPlan.totalCost;


    // Status

    if (
        /Status\s*:\s*WITHIN\s+BUDGET/i.test(
            section
        )
    ) {

        bestPlan.status =
            "WITHIN BUDGET";

    }
    else if (
        /Status\s*:\s*OVER\s+BUDGET/i.test(
            section
        )
    ) {

        bestPlan.status =
            "OVER BUDGET";

    }


    // Destinations

    bestPlan.destinations =
        parseListBetween(
            section,
            "Destinations:",
            "Activities:"
        ).map(name => ({

            name: name,

            travelCost:
                bestPlan.travelCost,

            hotelCost:
                bestPlan.hotelCost,

            activities: []

        }));


    // Activities

    const activities =
        parseListBetween(
            section,
            "Activities:",
            "Travel Cost:"
        );


    bestPlan.activities =
        activities;


    // Put activities into first destination
    if (
        bestPlan.destinations.length > 0
    ) {

        bestPlan.destinations[0].activities =
            activities.map(activity => ({

                name: activity,
                cost: 0

            }));

    }


    // Fallback destination names

    if (
        bestPlan.destinations.length === 0 &&
        Array.isArray(inputDestinations)
    ) {

        bestPlan.destinations =
            inputDestinations.map(destination => ({

                name:
                    destination.name,

                travelCost:
                    destination.travelCost || 0,

                hotelCost:
                    destination.hotelCost || 0,

                activities:
                    destination.activities || []

            }));

    }


    return bestPlan;
}


// ======================================================
// PARSE ALL GENERATED PLANS
// ======================================================

function parseAllPlans(
    output,
    budget
) {

    const plans = [];

    if (
        !output ||
        !output.trim()
    ) {

        return plans;
    }


    // IMPORTANT:
    // C++ prints:
    //
    // ALL GENERATED TRIP PLANS
    //
    // NOT "ALL GENERATED PLANS"

    const allPlansMatch =
        output.match(
            /ALL\s+GENERATED\s+TRIP\s+PLANS[\s\S]*?(?=DYNAMIC\s+PROGRAMMING\s+OPTIMIZATION|BEST\s+PLAN|$)/i
        );


    if (!allPlansMatch) {

        console.log(
            "ALL GENERATED TRIP PLANS section not found."
        );

        return plans;
    }


    const section =
        allPlansMatch[0];


    // Each C++ plan starts with:
    //
    // PLAN 1
    // PLAN 2
    // PLAN 3

    const planRegex =
        /(?:^|\n)\s*PLAN\s+(\d+)\s*\n([\s\S]*?)(?=\n\s*PLAN\s+\d+\s*\n|$)/gi;


    let match;


    while (
        (match = planRegex.exec(section))
        !== null
    ) {

        const planNumber =
            Number(match[1]);


        const planText =
            match[2] || "";


        const destinations =
            parseListBetween(
                planText,
                "Destinations:",
                "Activities:"
            );


        const activities =
            parseListBetween(
                planText,
                "Activities:",
                "Travel Cost:"
            );


        const travelCost =
            parseCost(
                planText,
                "Travel Cost"
            );


        const hotelCost =
            parseCost(
                planText,
                "Hotel Cost"
            );


        const activityCost =
            parseCost(
                planText,
                "Activity Cost"
            );


        const total =
            parseCost(
                planText,
                "Total Cost"
            );


        const status =
            /Status\s*:\s*WITHIN\s+BUDGET/i.test(
                planText
            )
                ? "WITHIN BUDGET"
                : "OVER BUDGET";


        plans.push({

            planNumber:

                planNumber,

            destinations:

                destinations,

            activities:

                activities,

            travelCost:

                travelCost,

            hotelCost:

                hotelCost,

            activityCost:

                activityCost,

            total:

                total,

            totalCost:

                total,

            budget:

                Number(budget),

            status:

                status

        });

    }


    console.log(
        "Plans Parsed:",
        plans.length
    );


    return plans;
}


// ======================================================
// OPTIMIZE
// ======================================================

app.post(
    "/optimize",
    (req, res) => {

        try {

            const data =
                req.body;


            // Validation

            if (!data) {

                return res.status(400).json({

                    success: false,

                    message:
                        "No trip data received."

                });

            }


            if (
                data.budget === undefined ||
                data.people === undefined ||
                data.days === undefined ||
                !Array.isArray(
                    data.destinations
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid trip data."

                });

            }


            if (
                data.destinations.length === 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "At least one destination is required."

                });

            }


            // Create C++ input

            const cppInput =
                createCppInput(data);


            // C++ executable

            const cppPath =
                path.join(
                    __dirname,
                    "tripplanner.exe"
                );


            console.log(
                "\n========================================"
            );

            console.log(
                "New Trip Optimization Request"
            );

            console.log(
                "========================================"
            );

            console.log(
                "Budget:",
                data.budget
            );

            console.log(
                "People:",
                data.people
            );

            console.log(
                "Days:",
                data.days
            );

            console.log(
                "Destinations:",
                data.destinations.length
            );


            // Start C++

            const cppProcess =
                spawn(cppPath);


            let output = "";
            let errorOutput = "";


            cppProcess.stdout.on(
                "data",
                chunk => {

                    output +=
                        chunk.toString();

                }
            );


            cppProcess.stderr.on(
                "data",
                chunk => {

                    errorOutput +=
                        chunk.toString();

                }
            );


            // Send input

            cppProcess.stdin.write(
                cppInput
            );

            cppProcess.stdin.end();


            // Process finished

            cppProcess.on(
                "close",
                code => {

                    console.log(
                        "C++ process exited with code:",
                        code
                    );


                    if (code !== 0) {

                        console.error(
                            "C++ Error:",
                            errorOutput
                        );


                        return res.status(500).json({

                            success: false,

                            message:
                                "C++ optimization failed.",

                            error:
                                errorOutput

                        });

                    }


                    // Best plan

                    const bestPlan =
                        parseBestPlan(
                            output,
                            data.budget,
                            data.destinations
                        );


                    // All plans

                    const plans =
                        parseAllPlans(
                            output,
                            data.budget
                        );


                    console.log(
                        "Best Plan Cost:",
                        bestPlan.total
                    );


                    console.log(
                        "Plans Parsed:",
                        plans.length
                    );


                    return res.json({

                        success: true,

                        message:
                            "Trip optimization completed successfully.",

                        output:
                            output,

                        bestPlan:
                            bestPlan,

                        plans:
                            plans

                    });

                }
            );


            cppProcess.on(
                "error",
                error => {

                    console.error(
                        "Failed to start C++:",
                        error
                    );


                    return res.status(500).json({

                        success: false,

                        message:
                            "Could not start C++ program.",

                        error:
                            error.message

                    });

                }
            );

        }

        catch (error) {

            console.error(
                "Server Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Internal server error.",

                error:
                    error.message

            });

        }

    }
);


// ======================================================
// START SERVER
// ======================================================

app.listen(
    PORT,
    () => {

        console.log(
            "\n========================================"
        );

        console.log(
            "Server running at:"
        );

        console.log(
            `http://localhost:${PORT}`
        );

        console.log(
            "\nC++ Dynamic Programming:"
        );

        console.log(
            "READY ✅"
        );

        console.log(
            "\nWaiting for trip optimization requests..."
        );

        console.log(
            "========================================\n"
        );

    }
);