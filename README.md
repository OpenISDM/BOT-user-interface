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

i. copy image files(jpg|png) to /server/public/map
ii. run command in terminal "npm run webp".

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
ngrok http -subdomain=bidae-tech -bind-tls=true 443
```

## Usage Guide

### SQL command interface

If user would like to modify or add the sql command, query functions used in BOT are list in ./query.js and all sql query string are list in ./queryType.js.

### Data request interface

In ./client/js/api/index.js, there are the list of requests used in UI code. The default router is http://localhost:3000. If user would like to modify or create new data retrieving url, one can find the info in this file.

### Set up map bounds

* Calculate to get ratio of image size (Width / Height)
* To get right-upper point coordinate of image, first we need to know real height and width in meter.
* second, to calculate meter to coordinates at geographic coordinate system
* 1 meter = 0.00000900900901 degree
* for example, width is 6 and height is 24
* we can get

  0.00005405405 (6 x 0.00000900900901)
  0.00021621621 (24 x 0.00000900900901)

* and we get only thrid/fourth decimal point to get number in meter
* then we get

  5405
  21621

``` javascript
   bounds: [
       [0, 0], // left-bottom point coordinate
       [5405, 21621], // right-upper point coordinate
   ],
```

### Set up IPC

Copy cmdServerIPC.exe from BOT Server build to ipc folder which default path is ipc/
Please make sure all necessary *.dll files should be included in that folder such as "libEncrypt.dll".
