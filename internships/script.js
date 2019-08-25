const Airtable = require('airtable');
const dotenv = require('dotenv');
const fs = require('fs');
const pug = require('pug');
const pretty = require('pretty');


// Configurations
dotenv.config();
var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('app1x793Xb2v90v8a');

base('Internships').select({
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    // Store records in the table json data struction
    var table = new InternshipTable();

    records.forEach(function(record) {
    	table.push(record.fields);
    });


    // Write the HTML file
    const compiledFunction = pug.compileFile('template.pug');
    html_str = compiledFunction(table);
    fs.writeFile('output.html', pretty(html_str), (err) => {
    	// Catch error
    	if (err) throw err;

    	console.log('HTML file created!');
    });

    // Write the JSON file
    var json_str = JSON.stringify(table, null, 2);
    fs.writeFile('output.json', json_str, (err) => {
    	// Catch error
    	if (err) throw err;

    	console.log('JSON file created!');
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
});




class InternshipTable {
	constructor() {
		this.industries = {
            "Marketing": [],
            "Software": [],
            "Consulting": [],
            "Accounting": [],
            "Operations": [],
            "Finance": [],
            "Human Resources": [],
            "Sales": [],
            "Product Management": [],
            "Administration": []
        }
	}
	push(record) {
		// Get the industry obj that the record belongs to
    	var industry_obj = this.industries[record['Industry'][0]];
    	var year_obj = this.getYear(industry_obj, record['Year']);
    	if (!year_obj) {
    		// Set year_obj if it is null
    		year_obj = {
    			"year": record['Year'],
    			"records": []
    		};
    		industry_obj.push(year_obj);
    	}
    	year_obj['records'].push(record);
	}
	getYear(industry_obj, year_name) {
		// Loop through the years
		for (var i = 0; i < industry_obj.length; i++) {
			// Attempt to find the year object that matches the one in the record
			if (industry_obj[i]['year'] == year_name) return industry_obj[i];
		}
		// Return null if not found
		return null;	
	}
}


function createHTML(table) {
	var template = {}
}


