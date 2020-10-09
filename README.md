# BOT-user-interface

This repository includes both the UI interface and the web server.

## Getting Started

### Installing

Please follow the below steps to build the environment.

Clone this repository to your local environment and change directoy to the file:

``` bash
git clone https://github.com/OpenISDM/BOT-user-interface.git && cd BOT-user-interface
```

Install all the dependency in package.

``` bash
npm i
```

Copy the `.env.example` and rename the to `.env` . Set your local environment variable in `.env` .

``` bash
cp .env.example .env
```

Need to modify site_module file structure.

i. run command in terminal "npm run webp".
ii. import webp from site_module/img/map into siteConfig.
iii. add a new field, urlWebp, into each area module.

Covert png/jpg to webp

``` bash
npm run webp
```

Run the following to execute webpack bundling:

``` bash
npm run build
```

Encrypt database password

i. run command in terminal "npm run encrypt [DATABASE_PASSWORD] [KEY]" in the root folder to get the encrpyted string.
ii. fill the KEY and encrypted string in the field of KEY and DB_PASS in .env.

``` bash
For example:
npm run encrypt BeDIS@1807 mykey
```

To initiate the web server, execute below:

``` bash
npm run server
```

### ngrok settings

``` bash
ngrok http -subdomain=bidae-tech -bind-tls=true https://localhost
or
ngrok http -subdomain=bidae-tech -bind-tls=true 80
```

## Usage Guide

### SQL command interface

If user would like to modify or add the sql command, query functions used in BOT are list in ./query.js and all sql query string are list in ./queryType.js.

### Data request interface

In ./client/js/dataSrc.js, there are the list of requests used in UI code. The default router is http://localhost:3000. If user would like to modify or create new data retrieving url, one can find the info in this file.
