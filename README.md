# Arbitrary Polygon Selection Tool

### Instruction

Interactive data visualization tool for analyzing cell populations in blood test scatter plots using arbitrary polygon selection.

### Features

- **Scatter Plot Display:** 

Displays a scatter plot of cell distribution based on provided CSV data.
- **Arbitrary Polygon Drawing:** 

Enables users to freely draw polygons on the scatter plot to select cell populations.
- **Polygon Auto-Closure:** 

Automatically closes the polygon upon clicking the starting point.
- **Polygon Visibility Control:** 

Allows users to toggle the visibility of each drawn polygon.
- **Customizable Polygon Colors:** 

Supports setting different colors for each polygon for clear distinction.
- **Polygon Label Editing:** 

Enables users to edit the text labels of existing polygons.
- **Cell Count and Percentage Calculation:** 

Automatically calculates the number and percentage of cells within each polygon.
- **Polygon Stroke Style Adjustment:** 

Supports adjusting the line style (e.g., thickness, mark pattern) of polygon borders.
- **Polygon Boolean Operations:** 

Supports Boolean operations (AND, OR, NOT) between arbitrary polygon selections for more complex selections.
- **Polygon Z-Index Adjustment (Dragging):** 

Allows users to adjust the stacking order (z-index) of arbitrary polygons by dragging them.
- **Polygon Copy/Delete:** 

Supports copying and deleting existing polygons.

### Techniques

- Front-End Fundamental
  - HTML / CSS / JavaScript
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
