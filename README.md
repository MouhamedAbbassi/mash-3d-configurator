# Mashroom 3D Configurator

## Overview

This library provides a 3D configurator component for React applications, built using `@react-three/fiber` and `three.js`. The main component, `GLBViewer`, allows you to load and customize GLB models interactively.

## Installation

To use this library in your project, you need to install it along with its peer dependencies.

```sh
npm install mash-3d-configurator
npm install react@^19.0.0 react-dom@^19.0.0
```

## Usage

Here is an example of how to use the `GLBViewer` component in your React application:

```jsx
import React from 'react';
import { GLBViewer } from 'mash-3d-configurator';

function App() {
  return (
    <div className="App">
      <GLBViewer glbUrl="https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb" materialDefinitions={materialDefinitions} />
    </div>
  );
}

export default App;
```

## GLBViewer Component

The `GLBViewer` component allows you to load and customize a GLB model.

### Props

- `glbUrl`: The URL of the GLB model to load.
- `materialDefinitions`: JSON array for materials.

### Customization

The `GLBViewer` component provides an interface to select and customize parts of the model. You can select different parts and change their materials interactively.

### Development

To run the test environment for development:

```sh
npm install
npm run build:lib:watch
npm run dev:test

```

To run Storybook:

```sh
npm run dev:storybook
```

To build Storybook:

```sh
npm run build:storybook
```

## License

This project is licensed under the MIT License.
