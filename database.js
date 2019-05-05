const express = require('express');
const ADODB = require('node-adodb');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Connect my db
var connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=D:\\\Angular\\charts\\dashboard.accdb;Persist Security Info=False;');

app.get('/', function(req, res) {
    res.send('Hello World!');
});

// Port that will be listened
app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});

//THIS IS THE API ENDPOINT FOR THE GET REQUESTS**

app.get('/dashboard/getteamDetails', function(req, res) {
	
    console.log("/dashboard/getteamDetails:");
    querie = 'SELECT * FROM teamDetails';
    console.log("query", querie);
    connection
        .query(querie)
        .then(data => {
            console.log(JSON.stringify(data, null, 2));
            return res.send(data);
        })
        .catch(error => {
            console.error(error);
        });
});

app.get('/dashboard/getsprintdata/bu', function(req, res) {
	
    console.log("/dashboard/getsprintdata/bu", req.query.buHead);
    querie = 'SELECT * FROM teamData where teamName in (select teamName FROM teamDetails where buHead="' + req.query.buHead + '")';
    console.log("query", querie);
    connection
        .query(querie)
        .then(data => {
            console.log(JSON.stringify(data, null, 2));
            return res.send(data);
        })
        .catch(error => {
            console.error(error);
        });
});

app.get('/dashboard/getsprintdata/pod', function(req, res) {
	
    console.log("/dashboard/getsprintdata/pod:", req.query.podLead);
    querie = 'SELECT * FROM teamData where teamName in (select teamName FROM teamDetails where podLead ="' + req.query.podLead + '")';
    console.log("query", querie);
    connection
        .query(querie)
        .then(data => {
            console.log(JSON.stringify(data, null, 2));
            return res.send(data);
        })
        .catch(error => {
            console.error(error);
        });
});

app.get('/dashboard/getsprintdata/team', function(req, res) {
	
    console.log("/dashboard/getsprintdata/team:", req.query.teamName);
    querie = 'SELECT * FROM teamData where teamName="' + req.query.teamName + '"';
    console.log("query", querie);
    connection
        .query(querie)
        .then(data => {
            console.log(JSON.stringify(data, null, 2));
            return res.send(data);
        })
        .catch(error => {
            console.error(error);
        });
});

app.get('/dashboard/getsprintdata', function(req, res) {
	
    console.log("/dashboard/getsprintdata");
    querie = 'SELECT * FROM teamData';
    console.log("query", querie);
    connection
        .query(querie)
        .then(data => {
            console.log(JSON.stringify(data, null, 2));
            return res.send(data);
        })
        .catch(error => {
            console.error(error);
        });
});

app.get('/dashboard/getbudata', function(req, res) {
	
    console.log("/dashboard/getbudata");
    querie = 'SELECT distinct(buHead) FROM teamDetails';
    console.log("query", querie);
    connection
        .query(querie)
        .then(data => {
            console.log(JSON.stringify(data, null, 2));
            return res.send(data);
        })
        .catch(error => {
            console.error(error);
        });
});

app.get('/dashboard/getpodLeaddata', function(req, res) {
	
    console.log("/dashboard/getpodLeaddata");
    querie = 'SELECT distinct(podLead) FROM teamDetails';
    console.log("query", querie);
    connection
        .query(querie)
        .then(data => {
            console.log(JSON.stringify(data, null, 2));
            return res.send(data);
        })
        .catch(error => {
            console.error(error);
        });
});

app.get('/dashboard/getPodLeadBasedOnBuHead', function(req, res) {
	
    console.log("/dashboard/getPodLeadBasedOnBuHead:", req.query.buHead);
    querie = 'SELECT distinct(podLead) FROM teamDetails where buHead="' + req.query.buHead + '"';
    console.log("query", querie);
    connection
        .query(querie)
        .then(data => {
            console.log(JSON.stringify(data, null, 2));
            return res.send(data);
        })
        .catch(error => {
            console.error(error);
        });
});

app.get('/dashboard/getTeamListBasedOnBuHead', function(req, res) {
	
    console.log("/dashboard/getTeamListBasedOnBuHead:", req.query.buHead);
    querie = 'SELECT distinct(teamName) FROM teamDetails where buHead="' + req.query.buHead + '"';
    console.log("query", querie);
    connection
        .query(querie)
        .then(data => {
            console.log(JSON.stringify(data, null, 2));
            return res.send(data);
        })
        .catch(error => {
            console.error(error);
        });
});

app.get('/dashboard/getTeamListBasedOnPodLead', function(req, res) {
	
    console.log("/dashboard/getTeamListBasedOnPodLead:", req.query.podLead);
    querie = 'SELECT distinct(teamName) FROM teamDetails where podLead="' + req.query.podLead + '"';
    console.log("query", querie);
    connection
        .query(querie)
        .then(data => {
            console.log(JSON.stringify(data, null, 2));
            return res.send(data);
        })
        .catch(error => {
            console.error(error);
        });
});


app.post('/dashboard/postsprintdata', function(req, res) {
    console.log("/dashboard/postsprintdata:", req.body);
    query = 'INSERT INTO teamData(' 
							+ 'teamName'
							+ ',sprintName'
							+ ',sprintStartDate'
							+ ',sprintEndDate'
							+ ',capacity'
							+ ',storyCommited'
							+ ',storyCompleted'
							+ ',perCompletion'
							+ ',storiesReady'
							+ ',defectsLowerPlatform'
							+ ',defectsHigherPlatform'
							+ ',effortPerSp'
							+ ',wasteReqChanges'
							+ ',wasteDevTeamNotDeveloping'
							+ ',wasteDesignChanges'
							+ ',wasteProdIssues'
							+ ',wasteReworkDefects'
							+ ',perWasteReqChanges'
							+ ',perWasteDevTeamNotDeveloping'
							+ ',perWasteDesignChanges'
							+ ',perWasteProdIssues'
							+ ',perDefectRework'
							+ ',insprintNoOfScen'
							+ ',insprintRegression'
							+ ',insprintAutomated'
							+ ',comments) '
					+ 'VALUES ("' 
							+ req.body.teamName + '","' 
							+ req.body.sprintName + '","' 
							+ req.body.sprintStartDate + '","' 
							+ req.body.sprintEndDate + '",' 
							+ req.body.capacity + ',' 
							+ req.body.storyCommited + ',' 
							+ req.body.storyCompleted + ',' 
							+ req.body.perCompletion + ',' 
							+ req.body.storiesReady + ',' 
							+ req.body.defectsLowerPlatform + ',' 
							+ req.body.defectsHigherPlatform + ',' 
							+ req.body.effortPerSp + ',' 
							+ req.body.wasteReqChanges + ',' 
							+ req.body.wasteDevTeamNotDeveloping + ',' 
							+ req.body.wasteDesignChanges + ',' 
							+ req.body.wasteProdIssues + ',' 
							+ req.body.wasteReworkDefects + ',' 
							+ req.body.perWasteReqChanges + ',' 
							+ req.body.perWasteDevTeamNotDeveloping + ',' 
							+ req.body.perWasteDesignChanges + ',' 
							+ req.body.perWasteProdIssues + ',' 
							+ req.body.perDefectRework + ',' 
							+ req.body.insprintNoOfScen + ',' 
							+ req.body.insprintRegression + ',' 
							+ req.body.insprintAutomated + ',"' 
							+ req.body.comments 
							+ '")';
    console.log("query" + query);
    connection
        .execute(query)
        .then(data => {
            console.log(JSON.stringify(data, null, 2));
        })
        .catch(error => {
            console.error(error);
        });
});