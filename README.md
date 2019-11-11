Welcome to Mage School CYOA
=================
Here's an interactive version of an existing CYOA. Have fun!


top level
------
These files are not visible to visitors of the CYOA, but are very important.

`README.md` - This file!

`base.html` - The template HTML file. 

`server.js` - The JavaScript server code used to send users the HTML file

`update.js` - The JavaScript code that processes the template and the JSON files and builds `views/index.html`, `public/dataFile.json`,`public/sectionFile.json`

`watch.json` - Describes which files trigger rebuilding the project when modified

`package.json` - Defines which Javascript libraries are loaded and the initial command that starts the server.

assets
---------
Images go here. No, there aren't subfolders to organize things or the ability to bulk upload them.

data
-------
Folder for all the source JSON files that are used to define the CYOA. 

Not visible to visitors of the CYOA.

public
--------
All files in this folder are visible to visitors of the CYOA

`client.js` - The Javascript that

`dataFile.json` - This is a generated file that contains a node for each displayed element in the CYOA, with subnodes that describe details like cost, or name

`sectionFile.json` - This is a generated file that contains lists of what nodes belong to which sections

`style.css` - This file describes the CSS used to format `public/index.html`

views
--------
All files in this folder are visible to visitors of the CYOA

`index.html` - This is a generated file that is served to end users.


Made with [Glitch](https://glitch.com/)
-------------------

\ ゜o゜)ノ
