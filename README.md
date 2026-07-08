# Airafi
A Personal Finance Tracker

AiraFi is a production-ready, full-stack personal finance application engineered using the MERN stack (MongoDB, Express, React, Node.js). 

## 🚀 Core Features

- **Two-Step Secure Onboarding:** Separates credential authentication from deep profile configuration for optimal data security.
- **Hybrid Cache Engine:** Computes Net Balance, Total Income, and Total Expenses dynamically via MongoDB atomic operators (`$inc`), reducing dashboard read time to a lightning-fast $O(1)$ lookup.
- **TallyPrime-Style Period Filtering:** Queries transaction histories across specific date boundaries (e.g., specific month/year) smoothly using highly optimized compound indexing.
- **Granular Text Search:** Built-in case-insensitive regular expression ($regex) parsing to let users hunt down specific expenditures like "milk" or "bread" instantly.


- **Port Conflict Protection:** Configured natively to bypass macOS Port 5000 AirPlay service collisions by deploying on Port 8000.