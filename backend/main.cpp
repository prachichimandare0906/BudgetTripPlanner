#include <iostream>
#include <vector>
#include <string>
#include <cmath>
#include <limits>
#include <algorithm>

using namespace std;

// ===============================
// ACTIVITY
// ===============================

struct Activity {
    string name;
    int costPerPerson;
};

// ===============================
// DESTINATION
// ===============================

struct Destination {
    string name;
    int travelCostPerPerson;
    int hotelCostPerRoom;
    int roomCapacity;

    vector<Activity> activities;
};

// ===============================
// PLAN
// ===============================

struct Plan {
    vector<string> destinations;
    vector<string> activities;

    int travelCost = 0;
    int hotelCost = 0;
    int activityCost = 0;
    int totalCost = 0;
};

// ===============================
// DESTINATION VARIANT
// One destination + selected
// activities
// ===============================

struct DestinationVariant {
    string destinationName;
    vector<string> activities;

    int travelCost = 0;
    int hotelCost = 0;
    int activityCost = 0;
    int totalCost = 0;
};

// ===============================
// GLOBAL VARIABLES
// ===============================

int budget;
int numberOfPeople;
int numberOfDays;

vector<Destination> destinations;
vector<vector<DestinationVariant>> variants;

// ===============================
// SAFE INTEGER INPUT
// ===============================

int readInt() {
    string line;

    while (true) {
        getline(cin, line);

        try {
            size_t pos;
            int value = stoi(line, &pos);

            if (pos == line.length()) {
                return value;
            }
        }
        catch (...) {
        }

        cout << "Invalid number. Please enter again: ";
    }
}

// ===============================
// GENERATE ACTIVITY COMBINATIONS
// ===============================

void generateActivityCombinations(
    const Destination& destination,
    int index,
    vector<string>& selectedActivities,
    int activityCost,
    vector<DestinationVariant>& result
) {

    // Every subset of activities is a possible choice.
    // This includes selecting no activity.

    if (index == (int)destination.activities.size()) {

        DestinationVariant variant;

        variant.destinationName = destination.name;
        variant.activities = selectedActivities;

        variant.travelCost =
            destination.travelCostPerPerson * numberOfPeople;

        int rooms =
            (numberOfPeople + destination.roomCapacity - 1)
            / destination.roomCapacity;

        int nights = max(numberOfDays - 1, 1);

        variant.hotelCost =
            destination.hotelCostPerRoom * rooms * nights;

        variant.activityCost = activityCost * numberOfPeople;

        variant.totalCost =
            variant.travelCost +
            variant.hotelCost +
            variant.activityCost;

        result.push_back(variant);

        return;
    }

    // Option 1: Do not select activity

    generateActivityCombinations(
        destination,
        index + 1,
        selectedActivities,
        activityCost,
        result
    );

    // Option 2: Select activity

    selectedActivities.push_back(
        destination.activities[index].name
    );

    generateActivityCombinations(
        destination,
        index + 1,
        selectedActivities,
        activityCost +
        destination.activities[index].costPerPerson,
        result
    );

    selectedActivities.pop_back();
}

// ===============================
// CREATE VARIANTS
// ===============================

void createVariants() {

    variants.clear();

    for (const Destination& destination : destinations) {

        vector<DestinationVariant> destinationVariants;

        vector<string> selectedActivities;

        generateActivityCombinations(
            destination,
            0,
            selectedActivities,
            0,
            destinationVariants
        );

        variants.push_back(destinationVariants);
    }
}

// ===============================
// GENERATE ALL POSSIBLE PLANS
// ===============================

void generatePlans(
    int destinationIndex,
    vector<string>& selectedDestinations,
    vector<string>& selectedActivities,
    int travelCost,
    int hotelCost,
    int activityCost,
    vector<Plan>& allPlans
) {

    // All destinations processed
    if (destinationIndex == (int)variants.size()) {

        if (selectedDestinations.empty()) {
            return;
        }

        Plan plan;

        plan.destinations = selectedDestinations;
        plan.activities = selectedActivities;

        plan.travelCost = travelCost;
        plan.hotelCost = hotelCost;
        plan.activityCost = activityCost;

        plan.totalCost =
            travelCost +
            hotelCost +
            activityCost;

        allPlans.push_back(plan);

        return;
    }

    // Option 1:
    // Do not select this destination

    generatePlans(
        destinationIndex + 1,
        selectedDestinations,
        selectedActivities,
        travelCost,
        hotelCost,
        activityCost,
        allPlans
    );

    // Option 2:
    // Select this destination with
    // each possible activity combination

    for (const DestinationVariant& variant :
         variants[destinationIndex]) {

        selectedDestinations.push_back(
            variant.destinationName
        );

        for (const string& activity : variant.activities) {
            selectedActivities.push_back(
                variant.destinationName + " - " + activity
            );
        }

        generatePlans(
            destinationIndex + 1,
            selectedDestinations,
            selectedActivities,
            travelCost + variant.travelCost,
            hotelCost + variant.hotelCost,
            activityCost + variant.activityCost,
            allPlans
        );

        selectedDestinations.pop_back();

        for (size_t i = 0;
             i < variant.activities.size();
             i++) {

            selectedActivities.pop_back();
        }
    }
}

// ===============================
// REMOVE DUPLICATE PLANS
// ===============================

vector<Plan> removeDuplicatePlans(
    const vector<Plan>& plans
) {

    vector<Plan> uniquePlans;

    for (const Plan& plan : plans) {

        bool duplicate = false;

        for (const Plan& existing : uniquePlans) {

            if (
                plan.destinations == existing.destinations &&
                plan.activities == existing.activities &&
                plan.totalCost == existing.totalCost
            ) {
                duplicate = true;
                break;
            }
        }

        if (!duplicate) {
            uniquePlans.push_back(plan);
        }
    }

    return uniquePlans;
}

// ===============================
// PRINT PLAN
// ===============================

void printPlan(
    const Plan& plan,
    int planNumber
) {

    cout << "\n----------------------------------------\n";

    cout << "PLAN " << planNumber << "\n";

    cout << "Destinations:\n";

    for (const string& destination :
         plan.destinations) {

        cout << "  - " << destination << "\n";
    }

    cout << "Activities:\n";

    if (plan.activities.empty()) {

        cout << "  - No activities selected\n";

    } else {

        for (const string& activity :
             plan.activities) {

            cout << "  - " << activity << "\n";
        }
    }

    cout << "Travel Cost: Rs. "
         << plan.travelCost << "\n";

    cout << "Hotel Cost: Rs. "
         << plan.hotelCost << "\n";

    cout << "Activity Cost: Rs. "
         << plan.activityCost << "\n";

    cout << "Total Cost: Rs. "
         << plan.totalCost << "\n";

    if (plan.totalCost <= budget) {

        cout << "Status: WITHIN BUDGET\n";

    } else {

        cout << "Status: OVER BUDGET\n";
    }

    cout << "----------------------------------------\n";
}

// ===============================
// DYNAMIC PROGRAMMING
//
// Multiple Choice / Group Knapsack
//
// Each destination is a group.
// At most one variant from each
// destination can be selected.
//
// dp[destination][budget]
// stores the maximum achievable
// cost without exceeding budget.
// ===============================

Plan optimizeUsingDP(
    const vector<vector<DestinationVariant>>& destinationVariants
) {

    int n = destinationVariants.size();

    // dp[i][b] =
    // maximum cost achievable using
    // first i destinations with budget b

    vector<vector<int>> dp(
        n + 1,
        vector<int>(budget + 1, -1)
    );

    // choice[i][b] stores which variant
    // was selected for destination i.
    //
    // -1 = destination skipped

    vector<vector<int>> choice(
        n + 1,
        vector<int>(budget + 1, -1)
    );

    dp[0][0] = 0;

    // Process every destination
    for (int i = 1; i <= n; i++) {

        // First allow skipping destination

        for (int b = 0; b <= budget; b++) {

            dp[i][b] = dp[i - 1][b];

            choice[i][b] = -1;
        }

        // Try every possible variant

        for (
            int variantIndex = 0;
            variantIndex <
            (int)destinationVariants[i - 1].size();
            variantIndex++
        ) {

            const DestinationVariant& variant =
                destinationVariants[i - 1][variantIndex];

            int cost = variant.totalCost;

            for (int b = cost;
                 b <= budget;
                 b++) {

                if (dp[i - 1][b - cost] != -1) {

                    int newCost =
                        dp[i - 1][b - cost] + cost;

                    if (newCost > dp[i][b]) {

                        dp[i][b] = newCost;

                        choice[i][b] =
                            variantIndex;
                    }
                }
            }
        }
    }

    // Find the closest achievable cost
    // to the budget

    int bestBudget = 0;

    for (int b = 0; b <= budget; b++) {

        if (dp[n][b] > dp[n][bestBudget]) {

            bestBudget = b;
        }
    }

    // ===============================
    // RECONSTRUCT BEST PLAN
    // ===============================

    Plan bestPlan;

    int currentBudget = bestBudget;

    for (int i = n; i >= 1; i--) {

        int selectedVariant =
            choice[i][currentBudget];

        if (selectedVariant != -1) {

            const DestinationVariant& variant =
                destinationVariants[i - 1]
                                  [selectedVariant];

            bestPlan.destinations.push_back(
                variant.destinationName
            );

            for (
                const string& activity :
                variant.activities
            ) {

                bestPlan.activities.push_back(
                    variant.destinationName +
                    " - " +
                    activity
                );
            }

            bestPlan.travelCost +=
                variant.travelCost;

            bestPlan.hotelCost +=
                variant.hotelCost;

            bestPlan.activityCost +=
                variant.activityCost;

            currentBudget -=
                variant.totalCost;
        }
    }

    reverse(
        bestPlan.destinations.begin(),
        bestPlan.destinations.end()
    );

    reverse(
        bestPlan.activities.begin(),
        bestPlan.activities.end()
    );

    bestPlan.totalCost =
        bestPlan.travelCost +
        bestPlan.hotelCost +
        bestPlan.activityCost;

    return bestPlan;
}

// ===============================
// MAIN
// ===============================

int main() {

    cout << "========================================\n";
    cout << "     BUDGET TRIP PLANNER - C++\n";
    cout << "     Dynamic Programming Optimizer\n";
    cout << "========================================\n\n";

    // ===============================
    // INPUT BASIC TRIP DETAILS
    // ===============================

    cout << "Enter total budget: ";
    budget = readInt();

    cout << "Enter number of people: ";
    numberOfPeople = readInt();

    cout << "Enter number of days: ";
    numberOfDays = readInt();

    cout << "Enter number of destinations: ";
    int numberOfDestinations = readInt();

    // ===============================
    // INPUT DESTINATIONS
    // ===============================

    destinations.clear();

    for (int i = 0;
         i < numberOfDestinations;
         i++) {

        Destination destination;

        cout << "\n========================================\n";
        cout << "DESTINATION " << i + 1 << "\n";
        cout << "========================================\n";

        cout << "Destination name: ";
        getline(cin, destination.name);

        cout << "Travel cost per person: ";
        destination.travelCostPerPerson =
            readInt();

        cout << "Hotel cost per room per night: ";
        destination.hotelCostPerRoom =
            readInt();

        cout << "Room capacity: ";
        destination.roomCapacity =
            readInt();

        cout << "Number of activities: ";
        int numberOfActivities =
            readInt();

        for (int j = 0;
             j < numberOfActivities;
             j++) {

            Activity activity;

            cout << "\nActivity " << j + 1 << " name: ";

            getline(cin, activity.name);

            cout << "Activity cost per person: ";

            activity.costPerPerson =
                readInt();

            destination.activities.push_back(
                activity
            );
        }

        destinations.push_back(
            destination
        );
    }

    // ===============================
    // GENERATE DESTINATION VARIANTS
    // ===============================

    createVariants();

    // ===============================
    // GENERATE ALL PLANS
    // ===============================

    vector<Plan> allPlans;

    vector<string> selectedDestinations;
    vector<string> selectedActivities;

    generatePlans(
        0,
        selectedDestinations,
        selectedActivities,
        0,
        0,
        0,
        allPlans
    );

    allPlans =
        removeDuplicatePlans(allPlans);

    // ===============================
    // PRINT ALL PLANS
    // ===============================

    cout << "\n\n";
    cout << "========================================\n";
    cout << "       ALL GENERATED TRIP PLANS\n";
    cout << "========================================\n";

    cout << "Total plans generated: "
         << allPlans.size()
         << "\n";

    int planNumber = 1;

    for (const Plan& plan : allPlans) {

        printPlan(
            plan,
            planNumber
        );

        planNumber++;
    }

    // ===============================
    // DYNAMIC PROGRAMMING OPTIMIZATION
    // ===============================

    cout << "\n\n";
    cout << "========================================\n";
    cout << "      DYNAMIC PROGRAMMING OPTIMIZATION\n";
    cout << "========================================\n";

    Plan bestPlan =
        optimizeUsingDP(variants);

    // ===============================
    // BEST PLAN
    // ===============================

    cout << "\n";
    cout << "========================================\n";
    cout << "             BEST PLAN\n";
    cout << "========================================\n";

    cout << "Budget: Rs. "
         << budget << "\n";

    printPlan(
        bestPlan,
        1
    );

    cout << "\n";
    cout << "Maximum budget used without exceeding it: Rs. "
         << bestPlan.totalCost
         << "\n";

    cout << "Remaining budget: Rs. "
         << budget - bestPlan.totalCost
         << "\n";

    cout << "\n";
    cout << "Dynamic Programming optimization completed.\n";
    cout << "========================================\n";

    return 0;
}