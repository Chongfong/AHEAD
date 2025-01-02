# Arbitrary Polygon Selection Tool

### Instruction

Interactive data visualization tool for analyzing cell populations in blood test scatter plots using arbitrary polygon selection.

### Demo



https://github.com/user-attachments/assets/559a73d1-99c1-4e79-b2f7-4fa4ab1fdba5



### Features

- **Data Visualization:**
  - Scatter plot display of cell distribution from CSV data.

- **Polygon Selection:**
  - Arbitrary polygon drawing with auto-closure.
  - Polygon visibility control.
  - Customizable polygon colors.
  - Polygon label editing.
  - Calculate cell count and percentage within each polygon.

- **Polygon Manipulation:**
  - Adjust polygon stroke style.
  - Boolean operations (AND, OR, NOT) on polygons.
  - Z-index adjustment (dragging) for polygon layering.
  - Polygon copy and delete.

### Techniques

- Front-End Fundamental
  - HTML / CSS / JavaScript
  - TypeScript
- Frameworks & Library
  - React (Hooks)
  - react-chartjs-2
  - immutability-helper
  - lodash
  - papaparse
  - react-colorful
  - react-dnd
  - uuid
- Others
  - Lint Tool: ESLint (Airbnb Style Guide) / prettier
  - Version Control: Git / GitHub

### Tech Note

1. calculate the intersections by Set.
2. use papaparse for csv-loading, chunk size is set to 1mb.
3. use react-colorful for color select, clicking outside to close.
4. use react-dnd to drag and drop to change the order of the polygons.

### Components

| Components         | Description                    |
| ------------------ | ------------------------------ |
| PolygonDrawer      | layer of polygon drawer        |
| ScatterPlot        | layer of data dots             |
| CountSection       | Calculation part of polygons   |
| DraggableComponent | draggable component            |
| PolygonsSection    | Polygon details                |
| SettingsDisplay    | CountSection + PolygonsSection |
| ScatterPlotDisplay | integrate the other components |

### Quick Start

1. Copy the content of root folder to your project folder.
2. Run the cmd: `npm install` or `npm i`.
3. Run the cmd: `npm run start`.
