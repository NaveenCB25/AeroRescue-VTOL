Sure bro 👍 Here is the **full copy-paste `README.md` file**. Copy everything inside the code block and replace your current `README.md`.

````markdown
# AeroRescue-VTOL Mission Control

A software-only emergency VTOL drone mission simulator for **Smart India Hackathon 2026**.

It provides a dark aerospace-style interface for commanding a simulated emergency drone mission and monitoring the same mission from a second browser tab.

> **Simulation Only:** AeroRescue-VTOL does not connect to a physical drone, radar, battery, or charging hardware. Mission data, radar detection, NCB Technology, navigation, and flight operations are simulated concept functionality.

---

## What the Application Does

- Create and run an emergency drone mission.
- Select a destination on the monitoring map or through Global Operations.
- Start, pause, resume, abort, or return the simulated drone home.
- View route progress, GPS position, altitude, speed, battery, radar, and alerts.
- Simulate NCB wind energy and automatic top charging for an additional battery.
- Detect simulated obstacles using the radar system.
- Simulate automatic route recalculation when an obstacle is detected.
- Return the drone home when no safe route is available.
- Show destination arrival notifications.
- Show delivery verification notifications.
- Show Return-to-Home notifications.
- Save completed missions in in-browser mission history.
- Run COMMAND and MONITOR views side by side in separate browser tabs.

---

# Run the Project

## Requirements

- Node.js 18 or later
- npm 9 or later

---

## Install Dependencies

Open PowerShell in the project folder:

```powershell
cd "D:\VTOL 26"
npm install
````

---

## Start the Development Server

```powershell
npm run dev
```

Vite will start the development server.

Normally the application will be available at:

```text
http://localhost:5173
```

Keep the terminal running while using the application.

Press `Ctrl+C` in the terminal to stop the server.

---

# Two-Tab Operation: COMMAND + MONITOR

The application supports two browser tabs using the same simulated mission data.

## Tab 1 — COMMAND

Open:

```text
http://localhost:5173/#/mission-control
```

Purpose:

* Create mission
* Start mission
* Pause / Resume
* Emergency Abort
* Return Home
* Monitor detailed telemetry
* View radar and route safety
* Control the simulated mission

---

## Tab 2 — MONITOR

Open:

```text
http://localhost:5173/#/dashboard
```

Purpose:

* Monitor the active mission
* View drone position
* View route
* View battery
* View altitude
* View speed
* View radar status
* View NCB charging status
* View mission progress
* View mission notifications

---

## Open Both Tabs from PowerShell

```powershell
Start-Process "http://localhost:5173/#/mission-control"
Start-Process "http://localhost:5173/#/dashboard"
```

This opens the Commander and Monitoring views in separate browser tabs/windows.

---

# How Synchronization Works

The application uses the browser's `BroadcastChannel` API for real-time communication between browser tabs.

The latest mission state is also stored in browser storage so that a monitoring tab opened later can load the current mission state.

When the Commander tab changes the mission, the Monitor tab can receive updates for:

* Mission status
* Destination
* Route
* Mission progress
* Drone location
* Altitude
* Speed
* Heading
* Main battery
* Additional battery
* NCB charging status
* Generated energy
* GPS status
* Radar status
* Route safety
* Emergency alerts
* Mission notifications
* Mission event log
* Completed mission history

### Recommended Workflow

```text
COMMAND TAB
     |
     | Controls Mission
     v
Simulated Drone Mission
     |
     | Shared Mission State
     v
MONITOR TAB
     |
     | Displays Mission
     v
Live Monitoring
```

---

# Mission Workflow

## 1. Open COMMAND

Open the Mission Control page:

```text
#/mission-control
```

---

## 2. Select Destination

Select an emergency destination using:

* Monitoring Map
* Global Operations

The destination can represent an emergency location such as:

* Hospital
* Emergency Control Room
* Disaster Area
* Remote Location
* Rescue Location

---

## 3. Create Mission

Enter the required mission information and create the simulated mission.

The system prepares:

```text
Home
  ↓
Drone
  ↓
Emergency Destination
```

---

## 4. Start Mission

Select:

```text
START MISSION
```

The simulated drone begins the mission.

The status changes through simulated flight stages such as:

```text
READY
  ↓
TAKEOFF
  ↓
EN ROUTE
  ↓
DESTINATION
```

---

# Mission Notifications

The system provides simulated notifications during important mission events.

### Mission Started

```text
Mission Started
Mission started successfully.
Drone is taking off.
```

### En Route

```text
En Route
Drone is en route to the emergency destination.
```

### Destination Reached

```text
Destination Reached
Drone has reached the emergency destination.
```

### Payload Delivery

```text
Payload Delivery
Payload delivery initiated.
```

### Delivery Verified

```text
Delivery Verified
Emergency payload delivery has been completed.
```

### Return to Home

```text
Return-to-Home Started
Delivery completed. Drone is returning to home base.
```

### Returned Home

```text
Drone Reached Home
Drone has safely returned to the home location.
```

### Mission Completed

```text
Mission Completed
Emergency delivery mission completed successfully.
```

---

# Radar Safety System

The radar system is a simulated safety feature.

The system demonstrates the following concept:

```text
Radar Detection
      ↓
Obstacle Detected
      ↓
Warning
      ↓
Check Safe Route
      ↓
Safe Route Available?
    /       \
  YES        NO
   ↓          ↓
Recalculate   Return Home
Route
```

When an obstacle is detected:

```text
RADAR WARNING
Obstacle detected in the planned route.
```

The system can simulate route recalculation.

If no safe route is available:

```text
NO SAFE ROUTE
Returning to Home.
```

> **Important:** Radar detection and automatic rerouting are simulated software features. The application does not currently control a physical radar sensor.

---

# Battery and Energy Monitoring

The application simulates:

* Main Battery
* Additional Battery
* Battery percentage
* Battery consumption
* Charging status
* Energy generation
* Safe return condition

Example:

```text
Main Battery
     ↓
Drone Power

Additional Battery
     ↓
NCB Charging System
```

---

# NCB Technology

NCB Technology is a simulated concept for the AeroRescue-VTOL system.

The software demonstrates:

```text
Air Flow
   ↓
Wind Turbine
   ↓
Charge Controller
   ↓
Additional Battery
```

Features include:

* Wind energy simulation
* Turbine status
* Automatic top charging
* Charge controller
* Additional battery
* Energy generation display
* Battery monitoring
* Low battery safety logic

> **Important:** NCB Technology is currently a software simulation/concept. The application does not claim real charging, unlimited flight, or physical energy generation.

---

# Low Battery Safety

The software can simulate low-battery conditions.

Example:

```text
Low Battery
     ↓
Check Additional Battery
     ↓
Enough Energy?
   /       \
 YES        NO
  ↓          ↓
Continue    Return Home
```

The system can display:

```text
LOW BATTERY WARNING
```

and, when required:

```text
RETURN-TO-HOME ACTIVATED
```

---

# Main Pages

| Page            | Purpose                                  |
| --------------- | ---------------------------------------- |
| Dashboard       | Simple monitoring overview               |
| Mission Control | Detailed Commander / mission control     |
| NCB Charging    | NCB Technology and energy simulation     |
| Global Ops      | Destination selection and route planning |
| Mission History | Completed mission records                |
| Settings        | System configuration                     |

---

# Dashboard

The Dashboard is designed as a simple monitoring overview.

It shows important information such as:

* System status
* Mission status
* Main battery
* Additional battery
* NCB charging status
* Radar status
* GPS status
* Mission progress
* Recent mission information
* Monitoring map
* Mission notifications

The map remains available at the lower part of the Dashboard so the user can scroll down to view it.

### Dashboard Purpose

```text
DASHBOARD = MONITOR
```

---

# Mission Control

Mission Control is the main Commander interface.

It provides:

* Mission creation
* Start Mission
* Pause
* Resume
* Emergency Abort
* Return Home
* Mission progress
* Drone telemetry
* GPS information
* Altitude
* Speed
* Heading
* Main battery
* Additional battery
* NCB charging status
* Radar detection
* Route safety
* Emergency alerts
* Mission event log
* Monitoring map

The page is vertically scrollable so that all information can be viewed clearly on laptop screens.

### Mission Control Purpose

```text
MISSION CONTROL = COMMAND
```

---

# Global Operations

Global Operations provides simulated destination and route planning.

The operator can select an emergency destination and prepare the mission route.

The destination can represent:

* Hospital
* Emergency Control Room
* Disaster Location
* Remote Area
* Rescue Location

The system then prepares a simulated route from the Home location to the selected destination.

---

# Mission History

Completed missions are stored in browser storage.

Mission history can contain information such as:

* Mission ID
* Destination
* Mission status
* Delivery status
* Mission duration
* Battery information
* Completion status
* Return-to-home status

---

# Settings

The Settings page provides configuration options for the application.

Possible configuration areas include:

* Mission safety
* Return-to-home settings
* Battery settings
* Radar settings
* NCB Technology settings
* Simulation settings
* Alert settings
* System status

---

# Available Commands

Run the development server:

```powershell
npm run dev
```

Create an optimized production build:

```powershell
npm run build
```

Run the configured source-code linter:

```powershell
npm run lint
```

Serve the production build locally:

```powershell
npm run preview
```

---

# Project Structure

```text
src/

  App.tsx
  Main application layout and hash-based workspace URLs

  hooks/
    useMission.ts
    Simulation engine and cross-tab shared mission state

  components/
    DashboardOverview.tsx
    Monitoring-only dashboard

    MissionControl.tsx
    Commander controls and mission state

    MissionMap.tsx
    Leaflet map, drone marker, destination and route

    MetricCards.tsx
    Flight, battery, NCB, GPS and radar telemetry

    NCBChargingPage.tsx
    NCB Technology simulation page

    GlobalDestinationSelector.tsx
    Global destination operations

    MissionLogPanel.tsx
    Timestamped mission event log

    MissionHistory.tsx
    Completed mission records

  simulation.ts
  Route, position, heading and simulation utility functions
```

---

# Technology

The application is a software-only simulation built for demonstration purposes.

Main technologies include:

* React
* Vite
* TypeScript
* Tailwind CSS
* Leaflet / OpenStreetMap
* Browser BroadcastChannel API
* Browser Storage

---

# Safety and Simulation Notice

AeroRescue-VTOL is a software demonstration project.

The following features are simulated:

* Drone flight
* GPS
* Battery
* Radar
* Obstacle detection
* Route planning
* Automatic rerouting
* Return-to-home
* NCB charging
* Wind energy
* Payload delivery
* Mission notifications

The application does not currently provide:

* Physical drone control
* Real radar detection
* Real battery charging
* Real wind-energy generation
* Real-time aircraft control
* Real-world autonomous flight

Hardware integration can be considered as a future development stage.

---

# Developer

| Field   | Details               |
| ------- | --------------------- |
| Name    | Naveen CB             |
| Project | AeroRescue-VTOL       |
| Role    | Software Developer    |
| Event   | Smart India Hackathon |
| Year    | 2026                  |

---

# License

MIT — educational and demonstration use.

```
```
# 🚁 AeroRescue-VTOL Mission Control

### 🚨 Smart Emergency VTOL Drone Mission Simulation System

> **A software-only emergency VTOL drone mission simulator developed for Smart India Hackathon 2026.**

AeroRescue-VTOL is a web-based emergency drone mission-control and monitoring platform designed to demonstrate how a VTOL drone could be used for **emergency response, rescue support, medical delivery, disaster-area assistance, and intelligent mission monitoring**.

The system provides two synchronized interfaces:

* 🎮 **COMMAND** — Mission Control / Drone Commander
* 📡 **MONITOR** — Live Mission Monitoring Dashboard

The project also demonstrates **NCB Technology**, simulated wind-energy generation, automatic top charging, additional battery support, radar-based obstacle detection, route safety, Return-to-Home logic, and emergency mission notifications.

> ⚠️ **Simulation Only:** This project is a software demonstration. It does not currently control a physical drone, real radar, real battery, or real charging hardware.

---

# 📌 Table of Contents

* [🎯 Problem Statement](#-problem-statement)
* [💡 Proposed Solution](#-proposed-solution)
* [🚁 What We Built](#-what-we-built)
* [🌐 How the Website Works](#-how-the-website-works)
* [🎮 COMMAND Mode](#-command-mode)
* [📡 MONITOR Mode](#-monitor-mode)
* [🔄 Two-Tab Synchronization](#-two-tab-synchronization)
* [🗺️ Mission Workflow](#️-mission-workflow)
* [📍 Destination Selection](#-destination-selection)
* [📡 Radar Safety System](#-radar-safety-system)
* [🔋 Battery Management](#-battery-management)
* [⚡ NCB Technology](#-ncb-technology)
* [🔔 Mission Notifications](#-mission-notifications)
* [🏠 Return-to-Home](#-return-to-home)
* [📊 Dashboard](#-dashboard)
* [🎛️ Mission Control](#️-mission-control)
* [🌎 Global Operations](#-global-operations)
* [📜 Mission History](#-mission-history)
* [⚙️ Settings](#️-settings)
* [🛠️ Technology Stack](#️-technology-stack)
* [📁 Project Structure](#-project-structure)
* [▶️ How to Run](#️-how-to-run)
* [🖥️ Two-Browser-Tab Setup](#️-two-browser-tab-setup)
* [🔐 Safety and Simulation](#-safety-and-simulation)
* [🚀 Future Development](#-future-development)
* [👨‍💻 Developer](#-developer)
* [📄 License](#-license)

---

# 🎯 Problem Statement

During emergencies, disaster situations, remote-area incidents, and medical emergencies, reaching the required location quickly can be difficult.

Traditional emergency response systems can face challenges such as:

* 🚑 Difficult access to remote locations
* ⏱️ Delays in emergency delivery
* 🌧️ Difficult environmental conditions
* 🗺️ Lack of continuous mission visibility
* 🔋 Limited drone flight endurance
* 🚧 Unexpected obstacles
* 📡 Lack of centralized mission monitoring
* 🏠 Need for safe Return-to-Home operation

There is a need for an intelligent emergency-response concept that can demonstrate:

> **Fast mission planning + drone monitoring + route safety + battery awareness + emergency notifications + centralized control.**

---

# 💡 Proposed Solution

AeroRescue-VTOL provides a **web-based simulated VTOL emergency mission platform**.

The operator can:

1. 📍 Select an emergency destination
2. 🗺️ Generate a simulated route
3. 🚁 Start the mission
4. 📡 Monitor the drone in real time
5. 🔋 Monitor battery levels
6. 📡 Detect simulated obstacles
7. 🧭 Recalculate the route when possible
8. 📦 Simulate emergency payload delivery
9. 🔔 Receive mission notifications
10. 🏠 Automatically return the drone home when required
11. ⚡ Simulate NCB additional-energy charging
12. 📜 Save completed mission information

---

# 🚁 What We Built

AeroRescue-VTOL contains several interconnected modules.

### 🎮 Mission Control

The Commander can:

* Create missions
* Select destinations
* Start missions
* Pause missions
* Resume missions
* Abort missions
* Return Home
* Monitor telemetry
* View radar information
* View route safety
* View mission logs

### 📡 Live Monitoring

The monitoring dashboard displays:

* Mission status
* Drone position
* Route
* Battery
* Altitude
* Speed
* Heading
* GPS status
* Radar status
* NCB charging status
* Mission progress
* Alerts
* Notifications

### ⚡ NCB Technology

The project demonstrates a simulated energy concept:

```text
🌬️ Air Flow
      ↓
⚡ Wind Energy
      ↓
🔌 Charge Controller
      ↓
🔋 Additional Battery
      ↓
🚁 Drone Support
```

### 🛡️ Safety System

The simulator demonstrates:

* Radar detection
* Obstacle warning
* Safe-route checking
* Route recalculation
* Low-battery warning
* Return-to-Home

---

# 🌐 How the Website Works

The website is divided into different functional pages.

```text
                    🚁 AeroRescue-VTOL
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       🎮 COMMAND       📡 MONITOR       ⚡ NCB
          │                │                │
     Mission Control    Dashboard       Charging
          │                │
          └────────────┬───┘
                       │
                🔄 Shared Mission State
                       │
                🗺️ Simulation Engine
                       │
          ┌────────────┼────────────┐
          │            │            │
        📡 Radar     🔋 Battery    🧭 Route
          │            │            │
          └────────────┼────────────┘
                       │
                 🚁 Simulated Drone
```

---

# 🎮 COMMAND Mode

## Mission Control

The Mission Control page acts as the **Commander interface**.

```text
MISSION CONTROL = COMMAND
```

The operator can control the simulated mission from this interface.

### Available Controls

* ▶️ Start Mission
* ⏸️ Pause
* ▶️ Resume
* 🛑 Emergency Abort
* 🏠 Return Home
* 📍 Select Destination
* 🗺️ View Route
* 📡 View Radar
* 🔋 View Battery
* 📊 View Telemetry
* 📜 View Mission Log

The Mission Control page is vertically scrollable so that the complete mission information can be viewed clearly.

---

# 📡 MONITOR Mode

## Dashboard

The Dashboard acts as the **monitoring interface**.

```text
DASHBOARD = MONITOR
```

The monitoring user does not need the detailed command controls.

Instead, the dashboard focuses on mission awareness.

### Dashboard Displays

* 🚁 Drone status
* 📍 Current position
* 🗺️ Mission route
* 📊 Mission progress
* 🔋 Main battery
* 🔋 Additional battery
* ⚡ NCB charging
* 📡 Radar
* 🛰️ GPS
* 🏔️ Altitude
* 💨 Speed
* 🧭 Heading
* 🔔 Notifications
* ⚠️ Emergency alerts
* 🗺️ Monitoring map

The map remains available in its own section so the operator can scroll down and view it properly.

---

# 🔄 Two-Tab Synchronization

One of the important features of AeroRescue-VTOL is the ability to run the system in **two browser tabs**.

### Tab 1

```text
🎮 COMMAND
Mission Control
```

### Tab 2

```text
📡 MONITOR
Dashboard
```

Both tabs use the **same simulated mission state**.

### Example

```text
COMMAND TAB
     │
     │ Start Mission
     ↓
🚁 Simulated Drone
     │
     │ Shared Mission State
     ↓
MONITOR TAB
     │
     ├── 📍 Location
     ├── 🔋 Battery
     ├── 🏔️ Altitude
     ├── 💨 Speed
     ├── 📡 Radar
     └── 📊 Progress
```

The browser's `BroadcastChannel` API is used for communication between tabs.

The latest mission state is also stored in browser storage so the monitoring interface can load the current state.

---

# 🗺️ Mission Workflow

The complete simulated mission follows this sequence:

```text
        🏠 HOME
           │
           ↓
      📍 SELECT
     DESTINATION
           │
           ↓
      📝 CREATE
       MISSION
           │
           ↓
      🚁 START
       MISSION
           │
           ↓
        🛫 TAKEOFF
           │
           ↓
      🧭 EN ROUTE
           │
           ↓
     📡 RADAR CHECK
           │
           ↓
    🛡️ SAFE ROUTE?
       /        \
     YES         NO
      │           │
      ↓           ↓
  CONTINUE    🏠 RETURN HOME
      │
      ↓
📍 DESTINATION
      │
      ↓
📦 DELIVERY
      │
      ↓
✅ DELIVERY VERIFIED
      │
      ↓
🏠 RETURN TO HOME
      │
      ↓
🏁 MISSION COMPLETED
```

---

# 📍 Destination Selection

The operator can select an emergency destination through:

* 🗺️ Monitoring Map
* 🌎 Global Operations

Possible simulated destinations include:

* 🏥 Hospital
* 🚨 Emergency Control Room
* 🌪️ Disaster Area
* 🏔️ Remote Location
* 🆘 Rescue Location

The system then creates a simulated route from the home location to the selected destination.

---

# 📡 Radar Safety System

AeroRescue-VTOL includes a simulated radar safety system.

The concept is:

```text
📡 RADAR
   ↓
🚧 OBSTACLE DETECTED
   ↓
⚠️ WARNING
   ↓
🧭 CHECK SAFE ROUTE
   ↓
SAFE ROUTE AVAILABLE?
      /       \
    YES        NO
     ↓          ↓
🔄 RECALCULATE  🏠 RETURN HOME
   ROUTE
```

Example warning:

```text
⚠️ RADAR WARNING

Obstacle detected in the planned route.
Checking for a safe alternative route...
```

If a safe route is available:

```text
✅ SAFE ROUTE FOUND

Recalculating mission route...
```

If no safe route is available:

```text
🚨 NO SAFE ROUTE

Return-to-Home activated.
```

> ⚠️ Radar and obstacle detection are simulated software features. No physical radar sensor is connected.

---

# 🔋 Battery Management

The simulator provides two battery concepts:

### 🔋 Main Battery

Used as the primary simulated drone power source.

### 🔋 Additional Battery

Used as simulated reserve energy.

The system can display:

* Battery percentage
* Battery consumption
* Additional battery
* Charging status
* Energy generation
* Low-battery warning
* Return-to-Home status

### Battery Safety Logic

```text
🔋 LOW BATTERY
       ↓
CHECK ADDITIONAL BATTERY
       ↓
ENOUGH ENERGY?
     /       \
   YES        NO
    ↓          ↓
CONTINUE    🏠 RETURN HOME
```

---

# ⚡ NCB Technology

## NCB Technology — Simulated Energy Concept

NCB Technology is a concept integrated into the AeroRescue-VTOL simulation.

The system demonstrates simulated wind-energy generation and automatic top charging for an additional battery.

```text
🌬️ WIND
  ↓
⚡ ENERGY GENERATION
  ↓
🔌 CHARGE CONTROLLER
  ↓
🔋 ADDITIONAL BATTERY
  ↓
🚁 DRONE ENERGY SUPPORT
```

### NCB Features

* 🌬️ Wind-energy simulation
* ⚡ Energy generation
* 🔌 Charge controller
* 🔋 Additional battery
* 🔄 Automatic top charging
* 📊 Charging status
* 🔋 Battery monitoring
* ⚠️ Low-battery safety logic

> **Important:** NCB Technology is currently a software simulation/concept. It does not claim real physical charging or unlimited drone flight.

---

# 🔔 Mission Notifications

The system provides notifications for important mission events.

### 🚀 Mission Started

```text
Mission Started

Mission started successfully.
Drone is taking off.
```

### 🧭 En Route

```text
En Route

Drone is travelling to the emergency destination.
```

### 📍 Destination Reached

```text
Destination Reached

Drone has reached the emergency destination.
```

### 📦 Payload Delivery

```text
Payload Delivery

Emergency payload delivery initiated.
```

### ✅ Delivery Verified

```text
Delivery Verified

Emergency payload delivery has been completed.
```

### 🏠 Return-to-Home

```text
Return-to-Home Started

Delivery completed.
Drone is returning to home base.
```

### 🏠 Drone Reached Home

```text
Drone Reached Home

Drone has safely returned to the home location.
```

### 🏁 Mission Completed

```text
Mission Completed

Emergency delivery mission completed successfully.
```

---

# 🏠 Return-to-Home

Return-to-Home is an important simulated safety feature.

It can be activated when:

* 🔋 Battery becomes low
* 🚧 No safe route is available
* 🛑 Emergency abort is triggered
* 📦 Delivery has been completed
* 👨‍✈️ Commander selects Return Home

Example:

```text
MISSION
   ↓
DELIVERY COMPLETED
   ↓
🏠 RETURN-TO-HOME
   ↓
🧭 HOME ROUTE
   ↓
🏠 HOME LOCATION
   ↓
✅ MISSION COMPLETED
```

---

# 📊 Dashboard

The Dashboard provides a simplified overview.

### Main Information

| Information           | Purpose                   |
| --------------------- | ------------------------- |
| 🚁 Mission Status     | Current mission state     |
| 📍 Location           | Drone position            |
| 🗺️ Route             | Planned mission route     |
| 🔋 Battery            | Main battery level        |
| 🔋 Additional Battery | Reserve battery           |
| ⚡ NCB                 | Charging/energy status    |
| 📡 Radar              | Safety monitoring         |
| 🛰️ GPS               | Positioning status        |
| 📊 Progress           | Mission completion        |
| 🔔 Alerts             | Important notifications   |
| 🗺️ Map               | Visual mission monitoring |

---

# 🎛️ Mission Control

Mission Control contains detailed operational information.

### Sections

```text
🎮 COMMANDER
      ↓
📝 Mission Setup
      ↓
🎮 Mission Controls
      ↓
📊 Telemetry
      ↓
📡 Radar & Safety
      ↓
🔋 Battery
      ↓
⚡ NCB Technology
      ↓
🗺️ Mission Map
      ↓
📜 Mission Log
```

---

# 🌎 Global Operations

Global Operations is used for destination and route planning.

The operator can:

* 📍 Select a destination
* 🗺️ View the destination
* 🧭 Plan a route
* 🚨 Select an emergency location
* 📊 View simulated airspace information

Example:

```text
HOME
  │
  ├───────────────┐
  │               │
  ↓               ↓
🏥 Hospital    🚨 Disaster Area
  │               │
  └───────┬───────┘
          ↓
    📍 SELECT TARGET
          ↓
      🧭 PLAN ROUTE
```

---

# 📜 Mission History

Completed missions can be saved in browser storage.

Mission history can contain:

* 🆔 Mission ID
* 📍 Destination
* 📊 Mission status
* 📦 Delivery status
* ⏱️ Mission duration
* 🔋 Battery information
* 🏠 Return-to-Home status
* ✅ Completion status

---

# ⚙️ Settings

The Settings page provides configuration options for the simulation.

Possible settings include:

* 🛡️ Mission safety
* 🏠 Return-to-Home
* 🔋 Battery settings
* 📡 Radar settings
* ⚡ NCB Technology
* 🎮 Simulation settings
* 🔔 Alert settings
* 📊 System status

---

# 🛠️ Technology Stack

### Frontend

* ⚛️ React
* 📘 TypeScript
* ⚡ Vite
* 🎨 Tailwind CSS

### Maps

* 🗺️ Leaflet
* 🌍 OpenStreetMap

### Browser Technology

* 🔄 BroadcastChannel API
* 💾 Browser Storage

### Development

* 🟢 Node.js
* 📦 npm
* 🐙 Git
* 🐙 GitHub

---

# 📁 Project Structure

```text
AeroRescue-VTOL/
│
├── src/
│   │
│   ├── App.tsx
│   │
│   ├── simulation.ts
│   │
│   ├── hooks/
│   │   └── useMission.ts
│   │
│   └── components/
│       │
│       ├── DashboardOverview.tsx
│       │
│       ├── MissionControl.tsx
│       │
│       ├── MissionMap.tsx
│       │
│       ├── MetricCards.tsx
│       │
│       ├── NCBChargingPage.tsx
│       │
│       ├── GlobalDestinationSelector.tsx
│       │
│       ├── MissionLogPanel.tsx
│       │
│       └── MissionHistory.tsx
│
├── package.json
├── README.md
└── ...
```

---

# ▶️ How to Run

## Requirements

Install:

* 🟢 Node.js 18 or later
* 📦 npm 9 or later

---

## 1️⃣ Open the Project

Open PowerShell or terminal:

```powershell
cd "D:\VTOL 26"
```

---

## 2️⃣ Install Dependencies

```powershell
npm install
```

---

## 3️⃣ Start the Development Server

```powershell
npm run dev
```

The Vite development server normally runs at:

```text
http://localhost:5173
```

Keep the terminal running while using the application.

---

# 🖥️ Two-Browser-Tab Setup

## 🎮 COMMAND

Open:

```text
http://localhost:5173/#/mission-control
```

Use this tab to control the simulated mission.

---

## 📡 MONITOR

Open:

```text
http://localhost:5173/#/dashboard
```

Use this tab to monitor the same mission.

---

## PowerShell

You can open both automatically:

```powershell
Start-Process "http://localhost:5173/#/mission-control"

Start-Process "http://localhost:5173/#/dashboard"
```

---

# 🔄 Example Demo

### Tab 1 — COMMAND

```text
🎮 Mission Control

Destination:
🏥 Emergency Hospital

[ START MISSION ]

Mission Status:
🚁 EN ROUTE

Battery:
🔋 82%

Radar:
📡 ACTIVE
```

### Tab 2 — MONITOR

```text
📡 Live Monitoring

Mission:
🚁 EN ROUTE

Destination:
🏥 Emergency Hospital

Battery:
🔋 82%

Radar:
📡 ACTIVE

Progress:
████████░░ 80%
```

When the Commander changes the mission, the monitoring tab receives the updated simulated state.

---

# 🧪 Simulation Sequence

A typical demonstration can follow:

```text
1. 🎮 Open Mission Control
        ↓
2. 📍 Select destination
        ↓
3. 📝 Create mission
        ↓
4. ▶️ Start Mission
        ↓
5. 🛫 Drone Takeoff
        ↓
6. 🧭 Travel to destination
        ↓
7. 📡 Radar monitoring
        ↓
8. 📍 Destination Reached
        ↓
9. 📦 Payload Delivery
        ↓
10. ✅ Delivery Verified
        ↓
11. 🏠 Return-to-Home
        ↓
12. 🏠 Drone Reached Home
        ↓
13. 🏁 Mission Completed
        ↓
14. 📜 Save Mission History
```

---

# 🛡️ Safety and Simulation Notice

AeroRescue-VTOL is an educational and demonstration project.

The following are simulated:

* 🚁 Drone flight
* 🛰️ GPS
* 🔋 Battery
* 📡 Radar
* 🚧 Obstacle detection
* 🧭 Route planning
* 🔄 Route recalculation
* 🏠 Return-to-Home
* ⚡ NCB charging
* 🌬️ Wind energy
* 📦 Payload delivery
* 🔔 Mission notifications

The current software does **not** provide:

* ❌ Physical drone control
* ❌ Real radar detection
* ❌ Real battery charging
* ❌ Real wind-energy generation
* ❌ Real aircraft control
* ❌ Real autonomous flight

Hardware integration can be considered as a future development stage.

---

# 🚀 Future Development

Possible future improvements include:

### 🔌 Hardware Integration

Integration with:

* Drone flight controllers
* GPS modules
* Physical radar/sensors
* Battery-management systems
* Charging hardware

### 🤖 AI Integration

Future versions could explore:

* AI route optimization
* Intelligent obstacle avoidance
* Predictive battery management
* Emergency-location prioritization
* AI-based mission planning

### 📡 Advanced Communication

Possible integration with:

* LoRa
* 4G/5G
* Satellite communication
* IoT telemetry

### 🗺️ Advanced Mapping

Future features could include:

* Live map data
* 3D terrain
* Geofencing
* Airspace restrictions
* Dynamic weather information

---

# 🏆 Project Purpose

AeroRescue-VTOL demonstrates how a modern web interface can be used to simulate an emergency VTOL drone mission.

The core concept combines:

```text
🚁 VTOL DRONE
      +
🗺️ SMART NAVIGATION
      +
📡 RADAR SAFETY
      +
🔋 BATTERY MANAGEMENT
      +
⚡ NCB ENERGY CONCEPT
      +
🔔 REAL-TIME ALERTS
      +
🎮 COMMAND SYSTEM
      +
📡 MONITORING SYSTEM
```

The goal is to provide a clear software demonstration of an intelligent emergency-response drone platform.

---

# 👨‍💻 Developer

### Naveen CB

**Project:** AeroRescue-VTOL
**Role:** Software Developer
**Event:** Smart India Hackathon
**Year:** 2026

### 💻 Focus Areas

* Web Development
* React
* TypeScript
* IT & Technical Support
* Networking
* Software Development
* Drone Technology Concepts
* Emergency Response Systems

---

# 📄 License

MIT License — educational and demonstration use.

---

## ⭐ AeroRescue-VTOL

> 🚁 **Command the Mission. Monitor the Mission. Protect the Mission.**

**Built by Naveen CB for Smart India Hackathon 2026.**
