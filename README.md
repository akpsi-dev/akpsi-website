# akpsi-website
A project that helps facilitate the AKPsi website. It contains a script for pulling internship data from the AKPsi Airtable base for use by the Careers Page of the website.

If you are reading this you are probably the new Technology Chairman or a member of the Tech Committee. This readme will serve as Technical Documentation for this project.

## Internship Folder
This is a Node.js based project that generates an html table for the website.

* Uses npm
* Uses Airtable API as a back-end
* Uses pug to generate html

### script.js
This is the main script that generates the HTML and Javascript for the Careers page of the AKPsi website.

#### How to run the script
`npm start`

#### Output of the script
out/output.json: This is the json representation of the internships pulled from Airtable.
out/output.html: This is the html representation of the internships pulled from Airtable.

#### Copying output to Squarespace
The out/output.html is not ready to be copied to the Careers Page just yet. This output is just the static table portion or the final html. It needs to be combined with the javascript that runs on the page to handle the button animations.

Here is how to combine the static html with the javascript:
* Copy the contents of out/output.html. 
* Find the table.html file. 
* Navigate to the <body> tag. It is underneath the javascript, css, and navigation <div> class.
* Paste the contents of out/output.html on top of the <body> tag, i.e. replacing everything contained in the <body> tag as well as the <body> tag itself.
* Done. Now this table.html file has the javascript as well as new brand-new output that was just pulled from Airtable. You can copy and paste everything into the Careers Page now.

### template.pug
This specifies the generation of out/output.html. Basically, it specifies how the html table should look.
