// ======================================================
// TRIPWISE - BUDGET TRIP PLANNER
// ======================================================

let destinationCount = 0;


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ======================================================
// CREATE ACTIVITY
// ======================================================

function createActivityHTML() {

    return `
        <div class="activity-row">

            <input
                type="text"
                class="activity-name"
                placeholder="e.g. Scuba Diving"
            >

            <input
                type="number"
                class="activity-cost"
                min="0"
                placeholder="1000"
            >

            <button
                type="button"
                class="remove-activity-btn"
            >
                ✕
            </button>

        </div>
    `;
}


// ======================================================
// ADD DESTINATION
// ======================================================

function addDestination() {

    const container =
        document.getElementById(
            "destinationsContainer"
        );

    if (!container) {

        alert(
            "Destination container not found."
        );

        return;
    }


    destinationCount++;


    const card =
        document.createElement("div");


    card.className =
        "destination-card";


    card.innerHTML = `

        <div class="destination-header">

            <h3>
                🌍 Destination ${destinationCount}
            </h3>

            <button
                type="button"
                class="remove-btn"
            >
                ✕
            </button>

        </div>


        <div class="form-grid">

            <div class="form-group">

                <label>
                    Destination Name
                </label>

                <input
                    type="text"
                    class="destination-name"
                    placeholder="e.g. Goa"
                >

            </div>


            <div class="form-group">

                <label>
                    Travel Cost / Person
                </label>

                <input
                    type="number"
                    class="travel-cost"
                    min="0"
                    placeholder="3000"
                >

            </div>


            <div class="form-group">

                <label>
                    Hotel Cost / Room / Night
                </label>

                <input
                    type="number"
                    class="hotel-cost"
                    min="0"
                    placeholder="2000"
                >

            </div>


            <div class="form-group">

                <label>
                    Room Capacity
                </label>

                <input
                    type="number"
                    class="room-capacity"
                    min="1"
                    placeholder="2"
                >

            </div>

        </div>


        <div class="activities-section">

            <div class="activities-header">

                <h4>
                    🎯 Activities
                </h4>

                <button
                    type="button"
                    class="add-activity-btn"
                >
                    + Add Activity
                </button>

            </div>


            <div class="activities-container">

                ${createActivityHTML()}

            </div>

        </div>

    `;


    container.appendChild(card);


    console.log(
        `Destination ${destinationCount} added`
    );
}


// ======================================================
// REMOVE DESTINATION
// ======================================================

function removeDestination(button) {

    const card =
        button.closest(
            ".destination-card"
        );

    if (card) {
        card.remove();
    }

    updateDestinationNumbers();
}


// ======================================================
// UPDATE DESTINATION NUMBERS
// ======================================================

function updateDestinationNumbers() {

    const cards =
        document.querySelectorAll(
            ".destination-card"
        );


    cards.forEach(
        (card, index) => {

            const heading =
                card.querySelector(
                    ".destination-header h3"
                );

            if (heading) {

                heading.textContent =
                    `🌍 Destination ${index + 1}`;

            }

        }
    );


    destinationCount =
        cards.length;
}


// ======================================================
// ADD ACTIVITY
// ======================================================

function addActivity(button) {

    const section =
        button.closest(
            ".activities-section"
        );

    if (!section) {
        return;
    }


    const container =
        section.querySelector(
            ".activities-container"
        );

    if (!container) {
        return;
    }


    container.insertAdjacentHTML(
        "beforeend",
        createActivityHTML()
    );
}


// ======================================================
// REMOVE ACTIVITY
// ======================================================

function removeActivity(button) {

    const row =
        button.closest(
            ".activity-row"
        );

    if (!row) {
        return;
    }


    const container =
        row.parentElement;


    row.remove();


    if (
        container &&
        container.children.length === 0
    ) {

        container.insertAdjacentHTML(
            "beforeend",
            createActivityHTML()
        );

    }
}


// ======================================================
// GET DESTINATIONS
// ======================================================

function getDestinations() {

    const cards =
        document.querySelectorAll(
            ".destination-card"
        );


    const destinations = [];


    cards.forEach(card => {

        const name =
            card.querySelector(
                ".destination-name"
            )?.value.trim() || "";


        const travelCost =
            Number(
                card.querySelector(
                    ".travel-cost"
                )?.value || 0
            );


        const hotelCost =
            Number(
                card.querySelector(
                    ".hotel-cost"
                )?.value || 0
            );


        const roomCapacity =
            Number(
                card.querySelector(
                    ".room-capacity"
                )?.value || 1
            );


        const activities = [];


        const rows =
            card.querySelectorAll(
                ".activity-row"
            );


        rows.forEach(row => {

            const activityName =
                row.querySelector(
                    ".activity-name"
                )?.value.trim() || "";


            const activityCost =
                Number(
                    row.querySelector(
                        ".activity-cost"
                    )?.value || 0
                );


            if (activityName) {

                activities.push({

                    name:
                        activityName,

                    cost:
                        activityCost

                });

            }

        });


        destinations.push({

            name:
                name,

            travelCost:
                travelCost,

            hotelCost:
                hotelCost,

            roomCapacity:
                roomCapacity,

            activities:
                activities

        });

    });


    return destinations;
}


// ======================================================
// VALIDATE
// ======================================================

function validateTripData() {

    const startLocation =
        document.getElementById(
            "startLocation"
        )?.value.trim() || "";


    const people =
        Number(
            document.getElementById(
                "people"
            )?.value || 0
        );


    const budget =
        Number(
            document.getElementById(
                "budget"
            )?.value || 0
        );


    const days =
        Number(
            document.getElementById(
                "days"
            )?.value || 0
        );


    if (!startLocation) {

        alert(
            "Please enter your starting location."
        );

        return false;
    }


    if (people <= 0) {

        alert(
            "Please enter a valid number of people."
        );

        return false;
    }


    if (budget <= 0) {

        alert(
            "Please enter a valid budget."
        );

        return false;
    }


    if (days <= 0) {

        alert(
            "Please enter a valid number of days."
        );

        return false;
    }


    const destinations =
        getDestinations();


    if (
        destinations.length === 0
    ) {

        alert(
            "Please add at least one destination."
        );

        return false;
    }


    for (
        let i = 0;
        i < destinations.length;
        i++
    ) {

        if (!destinations[i].name) {

            alert(
                `Please enter Destination ${i + 1} name.`
            );

            return false;
        }


        if (
            destinations[i].roomCapacity <= 0
        ) {

            alert(
                `Please enter a valid room capacity for Destination ${i + 1}.`
            );

            return false;
        }

    }


    return true;
}


// ======================================================
// DISPLAY BEST PLAN
// ======================================================

function displayCppBestPlan(bestPlan) {

    const container =
        document.getElementById(
            "bestPlan"
        );


    if (!container) {
        return;
    }


    if (!bestPlan) {

        container.innerHTML = `
            <div class="best-plan-card">

                <h3>
                    🎯 Best Plan Near Budget
                </h3>

                <p>
                    No plan was found.
                </p>

            </div>
        `;

        return;
    }


    const total =
        Number(
            bestPlan.total ??
            bestPlan.totalCost ??
            0
        );


    const budget =
        Number(
            bestPlan.budget ??
            0
        );


    const remaining =
        Math.max(
            budget - total,
            0
        );


    const travelCost =
        Number(
            bestPlan.travelCost || 0
        );


    const hotelCost =
        Number(
            bestPlan.hotelCost || 0
        );


    const activityCost =
        Number(
            bestPlan.activityCost || 0
        );


    let destinationsHTML = "";


    if (
        Array.isArray(
            bestPlan.destinations
        ) &&
        bestPlan.destinations.length > 0
    ) {

        destinationsHTML =
            bestPlan.destinations
                .map(destination => {

                    let activitiesHTML =
                        "";


                    if (
                        Array.isArray(
                            destination.activities
                        ) &&
                        destination.activities.length > 0
                    ) {

                        activitiesHTML =
                            destination.activities
                                .map(activity => `

                                    <li>
                                        ${escapeHTML(
                                            activity.name
                                        )}
                                    </li>

                                `)
                                .join("");

                    }


                    return `

                        <div class="plan-destination">

                            <h4>
                                🌍
                                ${escapeHTML(
                                    destination.name
                                )}
                            </h4>

                            <p>
                                ✈️ Travel:
                                ₹${Number(
                                    destination.travelCost || 0
                                ).toLocaleString("en-IN")}
                            </p>

                            <p>
                                🏨 Hotel:
                                ₹${Number(
                                    destination.hotelCost || 0
                                ).toLocaleString("en-IN")}
                            </p>

                            ${
                                activitiesHTML
                                ? `
                                    <p>
                                        🎯 Activities:
                                    </p>

                                    <ul>
                                        ${activitiesHTML}
                                    </ul>
                                `
                                : ""
                            }

                        </div>

                    `;

                })
                .join("");

    }


    container.innerHTML = `

        <div class="best-plan-card">

            <div class="best-plan-title">

                <span>
                    ⭐
                </span>

                <div>

                    <h3>
                        Best Plan Near Budget
                    </h3>

                    <p>
                        Highest-cost valid plan
                        without exceeding your budget.
                    </p>

                </div>

            </div>


            <div class="best-plan-summary">

                <div class="summary-box">

                    <span>
                        Total Cost
                    </span>

                    <strong>
                        ₹${total.toLocaleString(
                            "en-IN"
                        )}
                    </strong>

                </div>


                <div class="summary-box">

                    <span>
                        Budget
                    </span>

                    <strong>
                        ₹${budget.toLocaleString(
                            "en-IN"
                        )}
                    </strong>

                </div>


                <div class="summary-box">

                    <span>
                        Remaining
                    </span>

                    <strong>
                        ₹${remaining.toLocaleString(
                            "en-IN"
                        )}
                    </strong>

                </div>

            </div>


            <div class="best-plan-cost-breakdown">

                <p>
                    ✈️ Travel:
                    ₹${travelCost.toLocaleString(
                        "en-IN"
                    )}
                </p>

                <p>
                    🏨 Hotel:
                    ₹${hotelCost.toLocaleString(
                        "en-IN"
                    )}
                </p>

                <p>
                    🎯 Activities:
                    ₹${activityCost.toLocaleString(
                        "en-IN"
                    )}
                </p>

                <p>
                    <strong>
                        Status:
                        ${escapeHTML(
                            bestPlan.status ||
                            "UNKNOWN"
                        )}
                    </strong>
                </p>

            </div>


            <div class="best-plan-destinations">

                ${destinationsHTML}

            </div>

        </div>

    `;
}


// ======================================================
// DISPLAY ALL PLANS
// ======================================================

function displayAllPlans(
    plans,
    cppOutput
) {

    const container =
        document.getElementById(
            "resultsContainer"
        );


    if (!container) {
        return;
    }


    // ==================================================
    // STRUCTURED PLANS
    // ==================================================

    if (
        Array.isArray(plans) &&
        plans.length > 0
    ) {

        container.innerHTML = `

            <div class="plans-grid"
                 id="plansGrid">
            </div>

        `;


        const grid =
            document.getElementById(
                "plansGrid"
            );


        // Find highest valid cost

        let bestTotal = -1;


        plans.forEach(plan => {

            const total =
                Number(
                    plan.total ??
                    plan.totalCost ??
                    0
                );


            const budget =
                Number(
                    plan.budget ||
                    0
                );


            if (
                total <= budget &&
                total > bestTotal
            ) {

                bestTotal =
                    total;

            }

        });


        plans.forEach(
            (plan, index) => {

                const total =
                    Number(
                        plan.total ??
                        plan.totalCost ??
                        0
                    );


                const budget =
                    Number(
                        plan.budget ||
                        0
                    );


                const travelCost =
                    Number(
                        plan.travelCost ||
                        0
                    );


                const hotelCost =
                    Number(
                        plan.hotelCost ||
                        0
                    );


                const activityCost =
                    Number(
                        plan.activityCost ||
                        0
                    );


                const withinBudget =
                    total <= budget;


                const isBest =
                    withinBudget &&
                    total === bestTotal;


                const destinations =
                    Array.isArray(
                        plan.destinations
                    )
                    ? plan.destinations
                    : [];


                const activities =
                    Array.isArray(
                        plan.activities
                    )
                    ? plan.activities
                    : [];


                const destinationsHTML =
                    destinations.length > 0

                    ? destinations
                        .map(
                            destination => `
                                <li>
                                    🌍
                                    ${escapeHTML(
                                        destination
                                    )}
                                </li>
                            `
                        )
                        .join("")

                    : `
                        <li>
                            —
                            No destination selected
                        </li>
                    `;


                const activitiesHTML =
                    activities.length > 0

                    ? activities
                        .map(
                            activity => `
                                <li>
                                    🎯
                                    ${escapeHTML(
                                        activity
                                    )}
                                </li>
                            `
                        )
                        .join("")

                    : `
                        <li>
                            —
                            No activities selected
                        </li>
                    `;


                grid.innerHTML += `

                    <div class="
                        plan-card
                        ${withinBudget
                            ? "valid"
                            : "over-budget"}
                    ">

                        ${
                            isBest
                            ? `
                                <div class="best-badge">
                                    ⭐ BEST PLAN
                                </div>
                            `
                            : ""
                        }


                        <div class="plan-header">

                            <span class="plan-number">

                                📋 Plan
                                ${
                                    plan.planNumber ||
                                    index + 1
                                }

                            </span>


                            <span class="
                                status
                                ${
                                    withinBudget
                                    ? "valid"
                                    : "invalid"
                                }
                            ">

                                ${
                                    withinBudget
                                    ? "✓ Within Budget"
                                    : "⚠ Over Budget"
                                }

                            </span>

                        </div>


                        <div class="plan-destinations">

                            <strong>
                                🌍 Destinations
                            </strong>

                            <ul>
                                ${destinationsHTML}
                            </ul>

                        </div>


                        <div class="plan-activities">

                            <strong>
                                🎯 Activities
                            </strong>

                            <ul>
                                ${activitiesHTML}
                            </ul>

                        </div>


                        <div class="plan-cost-breakdown">

                            <div>
                                ✈️ Travel

                                <strong>
                                    ₹${travelCost.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>


                            <div>
                                🏨 Hotel

                                <strong>
                                    ₹${hotelCost.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>


                            <div>
                                🎯 Activities

                                <strong>
                                    ₹${activityCost.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>

                        </div>


                        <div class="plan-cost">

                            ₹${total.toLocaleString(
                                "en-IN"
                            )}

                        </div>


                        <div class="plan-budget">

                            Budget:
                            ₹${budget.toLocaleString(
                                "en-IN"
                            )}

                        </div>


                        <div class="plan-budget">

                            ${
                                withinBudget

                                ? `
                                    Remaining:
                                    ₹${(
                                        budget - total
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                `

                                : `
                                    Over by:
                                    ₹${(
                                        total - budget
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                `
                            }

                        </div>

                    </div>

                `;

            }
        );


        return;
    }


    // ==================================================
    // FALLBACK
    // ==================================================

    if (
        cppOutput &&
        cppOutput.trim() !== ""
    ) {

        container.innerHTML = `

            <div class="cpp-results-card">

                <div class="plan-header">

                    <span class="plan-number">
                        📋 All Generated Plans
                    </span>

                    <span class="status valid">
                        ✓ Generated
                    </span>

                </div>


                <pre class="cpp-output">
${escapeHTML(cppOutput)}
                </pre>

            </div>

        `;

        return;
    }


    container.innerHTML = `

        <div class="no-results">

            <h3>
                No plans generated.
            </h3>

        </div>

    `;
}


// ======================================================
// GENERATE PLANS
// ======================================================

async function generatePlans() {

    if (
        !validateTripData()
    ) {
        return;
    }


    const button =
        document.getElementById(
            "generateBtn"
        );


    if (button) {

        button.disabled =
            true;

        button.innerHTML =
            "⏳ Generating Plans...";

    }


    try {

        const startLocation =
            document.getElementById(
                "startLocation"
            ).value.trim();


        const people =
            Number(
                document.getElementById(
                    "people"
                ).value
            );


        const budget =
            Number(
                document.getElementById(
                    "budget"
                ).value
            );


        const days =
            Number(
                document.getElementById(
                    "days"
                ).value
            );


        const destinations =
            getDestinations();


        const requestData = {

            startLocation:
                startLocation,

            people:
                people,

            budget:
                budget,

            days:
                days,

            destinations:
                destinations

        };


        console.log(
            "Sending data:",
            requestData
        );


        const response =
            await fetch(
              "https://budgettripplanner.onrender.com/optimize",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            requestData
                        )

                }
            );


        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );

        }


        const result =
            await response.json();


        console.log(
            "Backend response:",
            result
        );


        if (!result.success) {

            throw new Error(
                result.message ||
                "Trip optimization failed."
            );

        }


        // BEST PLAN

        displayCppBestPlan(
            result.bestPlan
        );


        // ALL PLANS

        displayAllPlans(
            result.plans,
            result.output
        );


        // SHOW RESULTS

        const results =
            document.getElementById(
                "results"
            );


        if (results) {

            results.style.display =
                "block";


            results.scrollIntoView({

                behavior:
                    "smooth"

            });

        }

    }

    catch (error) {

        console.error(
            "Generate Plans Error:",
            error
        );


        alert(
            "Unable to generate plans.\n\n" +
            error.message
        );

    }

    finally {

        if (button) {

            button.disabled =
                false;

            button.innerHTML =
                "🚀 Generate All Plans";

        }

    }
}


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "TripWise JavaScript loaded successfully."
        );


        // Add first destination

        const container =
            document.getElementById(
                "destinationsContainer"
            );


        if (
            container &&
            container.children.length === 0
        ) {

            addDestination();

        }


        // Add destination

        const addDestinationBtn =
            document.getElementById(
                "addDestinationBtn"
            );


        if (addDestinationBtn) {

            addDestinationBtn.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    addDestination();

                }
            );

        }


        // Generate

        const generateBtn =
            document.getElementById(
                "generateBtn"
            );


        if (generateBtn) {

            generateBtn.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    generatePlans();

                }
            );

        }


        // Dynamic buttons

        document.addEventListener(
            "click",
            function (event) {

                const target =
                    event.target;


                if (
                    target.classList.contains(
                        "remove-btn"
                    )
                ) {

                    event.preventDefault();

                    removeDestination(
                        target
                    );

                    return;

                }


                if (
                    target.classList.contains(
                        "add-activity-btn"
                    )
                ) {

                    event.preventDefault();

                    addActivity(
                        target
                    );

                    return;

                }


                if (
                    target.classList.contains(
                        "remove-activity-btn"
                    )
                ) {

                    event.preventDefault();

                    removeActivity(
                        target
                    );

                    return;

                }

            }
        );

    }
);