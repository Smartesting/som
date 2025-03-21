# SOM.js – A Lightweight Library for Detecting Interactive Elements on Web Pages
## Description
SOM.js (Set of Mark) is an open-source JavaScript library designed to identify and analyze interactive elements on a web page. It provides developers with an easy-to-use API to detect buttons, links, input fields, and other actionable elements, making it ideal for accessibility audits, automated testing, and user interaction tracking.

## Features
✅ Detects interactive elements such as buttons, links, inputs, and more

✅ Provides structured data on detected elements 

✅ Lightweight and fast, with no external dependencies

✅ Compatible with modern browsers and frameworks

## Installation
```sh
npm install som-js
```
or

```html
<script src="https://cdn.jsdelivr.net/npm/som-js"></script>
```

## Usage
```js
import SOM from 'som-js';

const interactiveElements = SOM.scan(document.body);
console.log(interactiveElements);
```

## Contribute
Contributions are welcome! Feel free to open issues, suggest features, or submit pull requests.

📌 GitHub Repo: github.com/Smartesting/som
📜 Licensed under MIT
