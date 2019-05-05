import { Injectable } from '@angular/core';
import * as express from 'express';
import {bodyParser} from 'body-parser';
import * as ADODB from 'node-adodb';
const app= express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
const connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=D:\\others\\codeathon\\dbconnection\\dashboard.accdb;Persist Security Info=False;');
@Injectable({
  providedIn: 'root'
})

export class DatabaseService {
// 	connection
// 			.query('SELECT * FROM teamDetails')
// 			.then(data => {
// 			console.log(JSON.stringify(data, null, 2));
// 			})
// 		.catch(error => {
// 			console.error(error);
// 			});
	
// 	//console.log(connection);
//     /* connection.connect(function(err) {
//         if (err) {
//           console.error('error connecting: ' + err.stack);
//           return;
//         }

//         console.log('connected as id ' + connection.threadId);
//     }); */

//     app.get('/', function (req, res) {
//     res.send('Hello World!');
//     });

//     // Port that will be listened
//      app.listen(3000, function () {
//       console.log('Example app listening on port 3000!');
//     }); 

//     // the query
//     var querie = 'SELECT * FROM teamDetails';

// //THIS IS THE API ENDPOINT FOR THE GET REQUESTS**

//     app.get('/dashboard/get/:teamName', function (req, res) {
// 		connection
// 			.query('SELECT * FROM teamDetails')
// 			.then(data => {
// 			console.log(JSON.stringify(data, null, 2));
// 			 return res.send({ error: false, data: data, message: 'Todos list.' });
// 			})
// 		.catch(error => {
// 			console.error(error);
// 			});
//     });


// app.post('/dashboard/post', function (req, res) {
// 	connection
// 			.execute('INSERT INTO Users(UserName, UserSex, UserAge) VALUES ("Newton", "Male", 25)', 'SELECT @@Identity AS id')
// 			.then(data => {
// 			console.log(JSON.stringify(data, null, 2));
// 			})
// 		.catch(error => {
// 		console.error(error);
// 		});	
//     });
  }