# ✈️ TripWise – Budget Trip Planner

TripWise is a budget-based trip planning system that generates
different possible travel plans and uses Dynamic Programming to
identify the best plan that stays within the user's budget.

---

## 🎯 Project Objective

The objective of TripWise is to help users plan trips based on:

- Starting location
- Number of people
- Total budget
- Number of days
- Multiple destinations
- Travel costs
- Hotel costs
- Room capacity
- Multiple activities at each destination

The system generates possible trip combinations and identifies
the plan that uses the maximum possible budget without exceeding
the user's limit.

---

## ✨ Features

- 📍 Starting location input
- 👥 Number of travellers
- 💰 Total budget
- 📅 Number of travel days
- 🗺️ Multiple destinations
- 🏨 Hotel cost calculation
- 🛏️ Automatic room calculation
- 🎯 Multiple activities per destination
- 💵 Activity cost calculation
- 📋 Generation of all possible plans
- ✅ Within-budget plans
- ⚠️ Over-budget plans
- ⭐ Best plan selection
- 🧠 Dynamic Programming optimization

---

## 🧠 Algorithm Used

TripWise uses **Dynamic Programming** to solve the budget
optimization problem.

The problem is modelled as a multiple-choice/group knapsack
optimization problem.

Each destination represents a group, and each possible activity
combination represents an option within that group.

The system selects combinations such that:

- At most one option is selected from each destination.
- The total cost does not exceed the available budget.
- The selected plan maximizes the total cost without exceeding
  the budget.

### DP State

```text
dp[i][b]