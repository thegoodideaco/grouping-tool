# grouping-example

## Par coords

The par coords component is made up of the following:

### Brushes

Each column will const of a brush, that will allow the user to select a vertical range.

We should extend this component to be used for x, y, and both x y. But can integrate vertical brushing first

### Ticks

Each column will also have ticks that should provide nicely spaced out values

### Field Columns

These columns should contain a brush and a tick component, should emit events based on it's range selection

### Line Renderer

The line renderer will display all of the records values. To make it performant, we will be using the canvas and requestAnimation to continuously draw each line.

Coloring, stroke size, and other style attributes should be extendable.

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
