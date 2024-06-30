# SchoolManagement
Welcome to the School Management repository! This web-based application is designed to streamline and enhance the management of school operations. Built with the MERN stack (MongoDB, Express.js, React, Node.js) and styled using Tailwind CSS, this system provides a modern interface for administrators that allows them to track data on classes , teachers and student.

## Table of Contents

- [Features](#features)
- [Bonus Features](#bonus-features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Features

### Data Management

1. **Core Models:**
   - **Class:**
     - Store details like class name, year, teacher, student fees, and student list.
   - **Teacher:**
     - Store teacher information including name, gender, date of birth, contact details, salary, assigned class, etc.
   - **Student:**
     - Store student information including name, gender, date of birth, contact details, fees paid, class, etc.

2. **CRUD Operations:**
   - Implement Create, Read, Update, and Delete operations for Class, Teacher, and Student models.

3. **Dynamic Forms:**
   - Develop forms that dynamically render input fields based on the selected model (Class, Teacher, Student).

4. **Class Limits:**
   - Add a limit to the number of students that can be enrolled in each class.

### Features

1. **Reusable Components:**
   - Create reusable React components for forms and tables to enhance code maintainability and reusability.

2. **Class Analytics Page:**
   - Clicking on a class in the class management page opens a class analytics page displaying:
     - Class details: name, year, teachers, student list, etc.
     - A graph showing the number of male and female students in the class.

3. **Financial Analytics Page:**
   - An analytics page displaying:
     - Expenses on teacher salaries.
     - Income generated from student fees.
   - Toggle between monthly and yearly views.
   - Options to select specific months and years for detailed analysis.

## Bonus Features

1. **Pagination:**
   - Implement pagination for tables and handle pagination logic in the backend.

2. **Filtering and Sorting:**
   - Add filtering and sorting logic for all models to enhance data management.

3. **Form Validation:**
   - Implement validation for all form fields to ensure data integrity and consistency.

## Installation

To get started with the School Management App, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/school-management-app.git
   cd school-management-app
2.**Install Dependencies:**
   -For the backend (Express.js, Node.js):
    ```bash
    cd backend
    npm install
