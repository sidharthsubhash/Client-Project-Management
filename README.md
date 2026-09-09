# CICF Pro

### Client Project Management & Operations Dashboard

**CICF Pro** is a modern project management dashboard designed for consultancy and client-service teams to manage web projects from **kickoff to launch**.

It provides a centralized workspace for tracking projects, clients, team members, timelines, project status, activity, and performance metrics.

> **Track. Manage. Deliver.**

---

## 🚀 Overview

Managing multiple client projects can quickly become difficult when project status, deadlines, team responsibilities, and client information are spread across different tools.

CICF Pro brings these workflows into a single dashboard.

The platform provides a centralized interface where users can:

* Monitor ongoing projects
* Track project progress and status
* Manage client information
* View team members and responsibilities
* Search and filter projects
* Monitor project activity
* View project analytics
* Add and manage projects
* Export project information
* Navigate between different operational sections

The application is designed as a **premium consultancy/project operations dashboard** with a clean, responsive interface.

---

## ✨ Key Features

### 📊 Dashboard

The main dashboard provides an overview of the organization's current projects and activity.

It includes:

* Project statistics
* Recent projects
* Activity feed
* Quick performance metrics
* Project status overview

The dashboard gives users a quick understanding of what is happening across their projects.

---

### 📁 Project Management

CICF Pro allows users to manage client projects from a centralized project workspace.

Users can:

* View all projects
* Add new projects
* Track project status
* Monitor project progress
* Search projects
* Filter project information
* Export project data

This makes it easier to manage multiple projects without relying on separate spreadsheets or tools.

---

### 👥 Client & Team Management

The application organizes information around both clients and team members.

Users can keep track of:

* Client organizations
* Project ownership
* Assigned team members
* Team responsibilities
* Project relationships

This provides better visibility into who is responsible for each project.

---

### 🔎 Global Search

CICF Pro includes a global search interface that allows users to quickly find relevant information across the dashboard.

This is particularly useful when managing a large number of projects, clients, and team members.

---

### 🔔 Activity & Notifications

The dashboard includes an activity feed and notification interface to help users stay aware of changes and recent project activity.

This provides a centralized view of important operational events.

---

### 📤 Data Export

Project information can be exported directly from the project management interface.

This allows teams to use project data outside the dashboard when required.

---

## 🖥️ Application Flow

```text
                    ┌─────────────────────┐
                    │      Login Page     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Main Dashboard  │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌───────────┐    ┌────────────┐   ┌───────────┐
        │ Projects  │    │  Clients   │   │   Team    │
        └─────┬─────┘    └────────────┘   └───────────┘
              │
              ▼
        ┌───────────────┐
        │ Project Detail│
        │ & Management  │
        └───────┬───────┘
                │
                ▼
        ┌────────────────┐
        │ Activity /     │
        │ Analytics      │
        └────────────────┘
```

---

## 🎨 User Interface

The application uses a modern dashboard-style interface with:

* Responsive layouts
* Sidebar navigation
* Top navigation bar
* Cards and data panels
* Search controls
* Project status indicators
* Interactive buttons and controls
* Login interface
* Mobile sidebar support

The application is designed to work across desktop and smaller screen sizes.

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Styling

* Custom CSS
* Responsive design
* CSS variables
* Modern dashboard UI patterns

### Data

* JSON-based project data
* Client information
* Team information
* Activity data

### Deployment

* Vercel

---

## 📁 Project Structure

```text
cicf_project/
│
├── data/
│   └── Project, client, team and application data
│
├── scripts/
│   └── JavaScript application logic
│
├── styles/
│   └── CSS styles and UI components
│
├── index.html
│   └── Main application interface
│
└── README.md
```

The repository is structured to separate **data, application logic, styling, and the main HTML interface**, making the project easier to maintain and extend.

---

## 🔐 Demo Login

The current prototype includes a demo authentication screen.

### Demo credentials

```text
Email: admin@cicf.io
Password: cicf2026
```

> **Note:** This authentication is intended for demonstration purposes. It is a frontend prototype and should not be treated as production-grade authentication.

---

## ⚙️ Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/sidharthsubhash/cicf_project.git
```

### 2. Navigate into the project

```bash
cd cicf_project
```

### 3. Run the project

Since this is a frontend application, it can be opened directly through a local development server.

For example, using VS Code Live Server or another static HTTP server.

You can also use Python:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

---

## 🌐 Live Demo

The project is deployed and available online:

**CICF Pro:**
https://cicf-six.vercel.app/

---

## 📸 Screenshots

Add screenshots of the application here to give visitors an immediate understanding of the interface.

### Login

```text
Add screenshot here
```

### Dashboard

```text
Add screenshot here
```

### Project Management

```text
Add screenshot here
```

### Project Details

```text
Add screenshot here
```

---

## 🎯 Project Goals

CICF Pro was designed to demonstrate how a modern project-management interface can centralize operational information for a consultancy or client-service organization.

The main goals are to:

* Improve project visibility
* Centralize client and team information
* Make project tracking easier
* Provide quick access to operational metrics
* Reduce dependency on scattered project-management tools
* Create a clean and intuitive user experience

---

## 🔮 Future Improvements

The current version is a frontend prototype. Potential future improvements include:

* 🔐 Secure backend authentication
* 👤 Role-based access control
* 🗄️ Database integration
* ☁️ Cloud-based project storage
* 🔄 Real-time project updates
* 📧 Email notifications
* 📅 Calendar and deadline integration
* 📈 Advanced project analytics
* 💬 Client communication system
* 📎 File/document management
* 📝 Task and milestone management
* 🔔 Real-time notifications
* 👥 Multi-organization support

---

## 📌 Project Status

**Prototype / Frontend Project**

CICF Pro currently focuses on the user interface and frontend experience for a client project management platform.

The architecture can be extended with a backend API and database to support persistent users, projects, authentication, permissions, and real-time collaboration.

---

## 👨‍💻 Author

**Sidharth Subhash**

GitHub:
https://github.com/sidharthsubhash

---

## ⭐ Contributing

Contributions, suggestions, and improvements are welcome.

If you have an idea for improving the dashboard or adding new project-management functionality, feel free to open an issue or submit a pull request.

---

## 📄 License

This project is currently intended as a personal/academic portfolio project.

If you plan to use or distribute the project commercially, add an appropriate open-source license to the repository.

---

### Built with HTML, CSS & JavaScript

**CICF Pro — Your project command centre.**
