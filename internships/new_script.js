const Airtable = require('airtable');
const dotenv = require('dotenv');
const fs = require('fs');
const pug = require('pug');
const pretty = require('pretty');

var industry_groupings = [
    {
        'name': 'af',
        'grouping': ["Accounting", "Finance"]
    },
    {
        'name': 'ms',
        'grouping': ["Marketing", "Sales"]
    },
    {
        'name': 'co',
        'grouping': ["Consulting", "Operations"]
    },
    {
        'name': 'ha',
        'grouping': ["Human Resources", "Administration"]
    },
    {
        'name': 'tp',
        'grouping': ["Software", "Product Management", "Technology"]
    }
];

class InternshipTable {
    constructor(industry_groupings) {
        this.industries = {};
        for (var grouping_obj of industry_groupings) {
            this.industries[grouping_obj['name']] = [];
        }
        this.key = industry_groupings;
    }
    push(record) {
        console.log(record['Active']);
        if (record['Active'] == null) {
            return // Do nothing on empty records
        }
        // Get the industry obj that the record belongs to
        var industry_obj = this.getIndustry(record['Industry']);
        var year_obj = this.getYear(industry_obj, record['Year']);
        if (!year_obj) {
            // Set year_obj if it is null
            year_obj = {
                "year": record['Year'],
                "records": []
            };
            industry_obj.push(year_obj);
            industry_obj.sort((a,b) => b["year"]-a["year"]);
        }
        year_obj['records'].push(record);
    }
    getIndustry(industry_name) {
        // Get the industry obj that the record belongs to
        for (var grouping_obj of this.key) {
            for (var group_item of grouping_obj['grouping']) {
                if (industry_name == group_item) {
                    return this.industries[grouping_obj['name']];
                }
            }
        }
        return null;
    }
    getYear(industry_obj, year_name) {
        // Loop through the years
        for (var year of industry_obj) {
            // Attempt to find the year object that matches the one in the record
            if (year['year'] == year_name) return year;
        }
        // Return null if not found
        return null;    
    }
}

// Store records in the table json data struction
var table = new InternshipTable(industry_groupings);

// Configurations
dotenv.config();
var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('app1x793Xb2v90v8a');

base('Internships').select({
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
        table.push(record.fields);
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }

    writeHTML()
    writeJSON()

});

function writeHTML() {
    // Write the HTML file
    const compiledFunction = pug.compileFile('template.pug');
    html_str = compiledFunction(table);
    fs.writeFile('output.html', pretty(html_str), (err) => {
        // Catch error
        if (err) throw err;

        console.log('HTML file created!');
    });
}

function writeJSON() {
    // Write the JSON file
    var json_str = JSON.stringify(table, null, 2);
    fs.writeFile('output.json', json_str, (err) => {
        // Catch error
        if (err) throw err;

        console.log('JSON file created!');
    });
}





