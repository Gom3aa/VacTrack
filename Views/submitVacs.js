
//-----------------------------HTML HELPER FUNCTIONS
var sDay, eDay, diffDays;

//Update Total Vacation Days from DB
function UpdateVacationDays() {
	document.getElementById('AllowedVacValueID').innerHTML = '100';
	document.getElementById('EnjoyedVacValueID').innerHTML = '60';
	document.getElementById('RemianingVacValueID').innerHTML = '40';
}

/*function UpdateVacationDays2() {//to trick user
	document.getElementById('AllowedVacValueID').innerHTML = '50';
	document.getElementById('EnjoyedVacValueID').innerHTML = '25';
	document.getElementById('RemianingVacValueID').innerHTML = '25';
}*/

/*Validate: -Vacation days Range.
*
* Return:- Vacation days range, starting & Ending date.
*/
function RangeInDays(){
	 sDay = document.getElementById('sDayID').value;
	 eDay = document.getElementById('eDayID').value;
	var startDate = (new Date(sDay)).getTime();
	var endDate = (new Date(eDay)).getTime();
	var timeDiff = endDate - startDate;
	diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
	if (diffDays <= 0) {
		alert('Ending date should be greater then Starting Date');
		return false;
	}
	var dates= [diffDays, sDay, eDay]
	return dates;
}
/*Validate Selction of: Vacation starting date*/
function sDayIDIsNaN(){
	var startDate = (new Date(document.getElementById('sDayID').value)).getTime();
	if (isNaN(startDate)) {
		window.alert("Please Pick up yor Starting Date.");
		document.getElementById("sDayID").focus();
	}
	else return true;
}
/*Validate Selction of: Vacation Ending date*/
function eDayIDIsNaN(){
	var endDate = (new Date(document.getElementById('eDayID').value)).getTime();
	if (isNaN(endDate)) {
		window.alert("Please Pick up yor Ending Date.");
		document.getElementById("eDayID").focus();
	}
	else return true;
}
/*Validate: Note is Empty & confirm with user.*/
function confirmNote(){
	var notes = document.getElementById('NotesVacID').value;
	if (notes !== '')
		return notes;
		return window.confirm("Your Notes are Empty, Confirm?");
}
/*Validate: */
function preReqSend(){
	var vacDays, notes;
	if(sDayIDIsNaN() && eDayIDIsNaN() &&
			(vacDays=RangeInDays()) && (notes=confirmNote())) {
		if (window.confirm('REQUEST:\n----> ' + vacDays[0] + ' days vacations request.\n----> FROM: ' + vacDays[1] + '    -    TO: ' + vacDays[2] + '\nAGREE?')) {
			//alert('submitted');
			sendReq();
		}
	}
	else alert('Request will not be sent.');

}

function sendReq () {
	var form = VactionSubmitionForm; document.getElementById("VactionSubmitionForm");
	alert('Your Request is sent.\n----> Your Vaction : ' + diffDays + ' day[s].\nFROM : '+ sDay+ ' ----- TO : ' + eDay);
}
//-----------------------------HTML HELPER FUNCTIONS Ending

//-----------------------------MONGODB CONNECTIONS
//------------------------------APP

var VacList=[];
// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/vacationsDb", function(err, db) {
  if(err) { return console.dir(err); }

	var collection = db.collection('vactionCollection');
	/*EmployeeVacs = {
		EmpName:Amin,
		TotalVacsAllowed:100,
		TotalVacsEnjoyed:60,
		ApprovedVacsList:[
			{#:1, VacDays:5, StartingDate:day1/month2/year16, EndingDate:day6/month2/year16, Notes:empNotes, Overridden:1 },
			{#:2, VacDays:2, StartingDate:01/02/2016, EndingDate:03/02/2016, Notes:travelling, Overridden:0 }
		],
		DeclinedVacsList:[
			{#:1, VacDays:5, StartingDate:day1/month2/year16, EndingDate:day6/month2/year16, Notes:empNotes, Overridden:1 }
		],
		RequestedVacsList:[
			{#:1, VacDays:5, StartingDate:day1/month2/year16, EndingDate:day6/month2/year16, Notes:empNotes, Overridden:0 }
		]
	}*/

var EmployeeVacs = {
			EmpName:"Amin",
			TotalVacsAllowed:100,
			TotalVacsEnjoyed:60,
			ApprovedVacsList:[
				{no:"1", VacDays:"5", StartingDate:"day1/month2/year16", EndingDate:"6/2/16",
					Notes:"empNotes", Overridden:"1" },//,
				{no:2, VacDays:2, StartingDate:new Date('01/02/2016'), EndingDate:new Date('03/02/2016'), Notes:'travelling', Overridden:0 }
			]//,
			// DeclinedVacsList:[
			// 	{#:1, VacDays:5, StartingDate:day1/month2/year16, EndingDate:day6/month2/year16, Notes:empNotes, Overridden:1 }
			// ],
			// RequestedVacsList:[
			// 	{#:1, VacDays:5, StartingDate:day1/month2/year16, EndingDate:day6/month2/year16, Notes:empNotes, Overridden:0 }
			// ]
		};
collection.insert(EmployeeVacs, {w:1}, function(err, result) {
	if (err)
		console.log(err);
	else
	console.log("added DOne 0");
});

var vac3 = {no:3, VacDays:3, StartingDate:'01/06/2016', EndingDate:'04/06/2016', Notes:'-noottravelling', Overridden:1};
collection.update({EmpName:"Amin"},{$addToSet:{ApprovedVacsList:vac3}}, {w:1}, function(err, result) {
	if (err)
		console.log(err);
	else
	console.log("added DOne 1");
});
//var vac3 = {no:3, VacDays:3, StartingDate:'01/06/2016', EndingDate:'04/06/2016', Notes:'-noottravelling', Overridden:1};
collection.update({EmpName:"Amin"},{$addToSet:{ApprovedVacsList:vac3}}, {w:1}, function(err, result) {
	if (err)
		console.log(err);
	else
	console.log("added DOne 2");
});

collection.insert(EmployeeVacs, {w:1}, function(err, result) {
	if (err)
		console.log(`can't Duplicate ${EmployeeVacs.EmpName}`);
	else
		console.log("added DOne");
});

//Testing query
/*
collection.find().toArray(function(err, docs){
	console.log("retrieved records:");
	console.log(docs[0].ApprovedVacsList[1].VacDays);
	console.log('length= ' + Object.keys(docs[0]).length);
});
*/

/*Functions*/
/*ListApprovedVacs: Return Arrray of all approved vacs*/
function ListApprovedVacs() {

	collection.find().toArray(function(err, docs){
		console.log("retrieved records:");
		var i;
		for (i=0; i<Object.keys(docs[0].ApprovedVacsList).length; i++){
			console.log(i+`=`);
			console.log(docs[0].ApprovedVacsList[i]);
		}
	});
}
function testing(){
	console.log('testing');
	ListApprovedVacs();
}

});//--------END MONGO CONNECTION
testing();
