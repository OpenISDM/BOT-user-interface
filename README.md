# BOT-user-interface

This repository includes both the UI interface and the web server.

## Getting Started

### Installing

Please follow the below steps to build the environment.

Clone this repository to your local environment and change directoy to the file:

```bash
git clone https://github.com/OpenISDM/BOT-user-interface.git && cd BOT-user-interface
```

Install all the dependency in package.

```bash
npm i
```

Copy the `.env.example` and rename the to `.env` . Set your local environment variable in `.env` .

```bash
cp .env.example .env
```

Run the following to execute webpack bundling:

```bash
npm run build
```

To initiate the web server, execute below:

```bash
npm run server
```

## Usage Guide

### SQL command interface

If user would like to modify or add the sql command, query functions used in BOT are list in ./query.js and all sql query string are list in ./queryType.js.

### Data request interface

In ./src/js/dataSrc.js, there are the list of requests used in UI code. The default router is http://localhost:3000. If user would like to modify or create new data retrieving url, one can find the info in this file.
