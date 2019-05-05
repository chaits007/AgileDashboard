import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { NgForm } from '@angular/forms';
import { GridOptions } from "ag-grid-community";
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor (private httpClient:HttpClient){ 
  }
  rowData=[];
  requests = [];
  listTeamNames = [];
  teamNameList = [];
  podLeadList=[];
  buHeadList=[];
  private ratio=0.0;
  private effortForSP=0.0;
  private reqChangesPer=0.0;
  private devTeamNotDevPer=0.0;
  private designChangesPer=0.0;
  private prodIssuesPer=0.0;
  private defectsPer=0.0;
  isAddNewHidden = true;
  isDashboardHidden = true;
  
  @ViewChild('sprintDetails') sprintDetailsForm: NgForm;

  ngOnInit() {
      //this.setDefaultValues();
      this.getTeamsList();
      this.getBuHeadList();
      this.getPodLeadList();
      this.getSprintData();
  }

    calculatePercent(){
      var ratioPer= Number(((this.sprintDetailsForm.value.completed/this.sprintDetailsForm.value.commited)*100).toFixed(2));
      var efforForSpPer= Number((this.sprintDetailsForm.value.capacityValue/this.sprintDetailsForm.value.completed).toFixed(2));
      var reqChangesPerTemp= Number( ((this.sprintDetailsForm.value.requirementChanges/this.sprintDetailsForm.value.capacityValue)*100).toFixed(2));
      var devTeamNotDevPerTemp= Number(((this.sprintDetailsForm.value.devTeamNotDeveloping/this.sprintDetailsForm.value.capacityValue)*100).toFixed(2));
      var designChangesPerTemp=Number(((this.sprintDetailsForm.value.designChanges/this.sprintDetailsForm.value.capacityValue)*100).toFixed(2));
      var prodIssuesPerTemp=Number(((this.sprintDetailsForm.value.prodIssues/this.sprintDetailsForm.value.capacityValue)*100).toFixed(2));
      var defectsPerTemp=Number(((this.sprintDetailsForm.value.defectsRework/this.sprintDetailsForm.value.capacityValue)*100).toFixed(2));
      this.ratio= (isNaN(ratioPer))?0.00:ratioPer;
      this.effortForSP= (isNaN(efforForSpPer))?0.00:efforForSpPer;
      this.reqChangesPer= (isNaN(reqChangesPerTemp))?0.00:reqChangesPerTemp;
      this.devTeamNotDevPer= (isNaN(devTeamNotDevPerTemp))?0.00:devTeamNotDevPerTemp;
      this.designChangesPer= (isNaN(designChangesPerTemp))?0.00:designChangesPerTemp;
      this.prodIssuesPer= (isNaN(prodIssuesPerTemp))?0.00:prodIssuesPerTemp;
      this.defectsPer= (isNaN(defectsPerTemp))?0.00:defectsPerTemp;
    }


  getTeamDataForGrid(event)
  {
    if(event.target.teamNameSelect.value !== 'undefined')
    {
      this.httpClient.get('http://localhost:3000/dashboard/getsprintdata/team',{ params: new HttpParams().set('teamName',event.target.teamNameSelect.value) })
      .subscribe(
          (data:any) => {
            console.log(data);
            this.rowData=data;
          }
        )
    }
    else if(event.target.podLeadSelect.value !== 'undefined')
    {
      this.httpClient.get('http://localhost:3000/dashboard/getsprintdata/pod',{ params: new HttpParams().set('podLead',event.target.podLeadSelect.value) })
      .subscribe(
          (data:any) => {
            console.log(data);
            this.rowData=data;
          }
        )
    }
    else if(event.target.buHeadSelect.value !== 'undefined')
    {
      this.httpClient.get('http://localhost:3000/dashboard/getsprintdata/bu',{ params: new HttpParams().set('buHead',event.target.buHeadSelect.value) })
      .subscribe(
          (data:any) => {
            console.log(data);
            this.rowData=data;
          }
        )
    }
    this.refreshChartData();
  }

  setPodLeadList(event)
  {
    this.httpClient.get('http://localhost:3000/dashboard/getPodLeadBasedOnBuHead',{ params: new HttpParams().set('buHead',event.target.value) })
    .subscribe(
        (data:any) => {
          console.log(data);
          this.podLeadList=data;
        }
      )
      this.httpClient.get('http://localhost:3000/dashboard/getTeamListBasedOnBuHead',{ params: new HttpParams().set('buHead',event.target.value) })
      .subscribe(
          (data:any) => {
            console.log(data);
            this.teamNameList=data;
          }
        )
  }

  setTeamList(event)
  {
    this.httpClient.get('http://localhost:3000/dashboard/getTeamListBasedOnPodLead',{ params: new HttpParams().set('podLead',event.target.value) })
    .subscribe(
        (data:any) => {
          console.log(data);
          this.teamNameList=data;
        }
      )
  }

  registerTeam(event){
    console.log("event triggered");
    event.preventDefault()
    const target = event.target;
    const teamName= target.querySelector('#teamName').value;
    const devLead= target.querySelector('#devLead').value;
    const podLead= target.querySelector('#podLead').value;
    const buhead= target.querySelector('#buhead').value;
    console.log(teamName, devLead);
    //this.getData(teamName)
    //this.postData(teamName, devLead, podLead, buhead);
  }


  getTeamDetails(event){
    event.preventDefault()
    const target = event.target;
    const teamName= target.querySelector('#teamNameGet').value;
    this.getData(teamName);
  }

  getTeamsList()
  {
    console.log("entered teams list");
    this.httpClient.get('http://localhost:3000/dashboard/getteamDetails')
    .subscribe(
        (data:any) => {
          console.log(data);
          this.listTeamNames=data;
          this.teamNameList=data;
          console.log(this.listTeamNames[0].teamName);
        }
      )
  }

  getBuHeadList()
  {
    console.log("entered teams list");
    this.httpClient.get('http://localhost:3000/dashboard/getbudata')
    .subscribe(
        (data:any) => {
          console.log(data);
          this.buHeadList=data;
          console.log(this.listTeamNames[0].teamName);
        }
      )
  }

  getPodLeadList()
  {
    console.log("entered teams list");
    this.httpClient.get('http://localhost:3000/dashboard/getpodLeaddata')
    .subscribe(
        (data:any) => {
          console.log(data);
          //this.listTeamNames=data;
          this.podLeadList=data;
          console.log(this.listTeamNames[0].teamName);
        }
      )
  }

  addSprintDetails(event){
    this.httpClient.post('http://localhost:3000/dashboard/postsprintdata', {})
.subscribe(
  (data:any[]) => {
    console.log(data);
  }
)
  }
  
 getData(teamName){
    this.httpClient.get('http://localhost:3000/dashboard/getteamdata',{ params: new HttpParams().set('teamName',teamName) })
      .subscribe(
          (data:any) => {
            console.log(data);
            this.rowData=data;
            //this.rowData=Array.of(data);
          }
        )
  }

  getSprintData(){
    this.httpClient.get('http://localhost:3000/dashboard/getSprintData')
      .subscribe(
          (data:any) => {
            console.log(data);
            this.rowData=data;
            //this.rowData=Array.of(data);
            //console.log(this.rowData);
          }
        )
  }
  
  public fillDashboard() {
    this.isDashboardHidden=!this.isDashboardHidden
    this.refreshChartData();
  }

  //Set Bar Chart Options
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      xAxes: [{ticks: {beginAtZero: true}}],
      yAxes: [{ticks: {beginAtZero: true}}]
    }
  };

  public barChartType = 'bar';
  public barChartLegend = true;
  
  //Set Line Chart Options
  public lineChartOptions: (ChartOptions) = {
    responsive: true,
    scales: {
      xAxes: [{ticks: {beginAtZero: true}}],
      yAxes: [{ticks: {beginAtZero: true}}]
  }};
  
  public lineChartColors: Color[] = [
    { 
      borderColor: '#E74C3C',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { 
      borderColor: '#1ABC9C',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { 
      borderColor: '#8E44AD',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { 
      borderColor: '#34495E',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];

  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartLabels: Label[] = ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4'];
  public barChartLabels = ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4'];

  public capacityVelocityData: ChartDataSets[] = [
    { fill: false, data: [0, 0, 0, 0], label: 'Velocity' },
    { fill: false, data: [0, 0, 0, 0], label: 'Real Capacity' },
    { fill: false, data: [0, 0, 0, 0], label: 'Budgeted Capacity', yAxisID: 'y-axis-0' }
  ];

  public wasteData: ChartDataSets[] = [
    { fill: false, data: [0, 0, 0, 0], label: 'Requirement Changes' },
    { fill: false, data: [0, 0, 0, 0], label: 'Design Changes' },
    { fill: false, data: [0, 0, 0, 0], label: 'Prod Issues' },
    { fill: false, data: [0, 0, 0, 0], label: 'Dev Team Not Developing', yAxisID: 'y-axis-0' }
  ];

  public inSprintAutomationData = [
    {data: [0, 0, 0, 0], label: 'Regression Scenarios'},
    {data: [0, 0, 0, 0], label: 'Scenarios Automated'}
  ];

  public defectsReworkData: ChartDataSets[] = [
    { fill: false, data: [0, 0, 0, 0], label: 'Defects - Rework', yAxisID: 'y-axis-0' }
  ];

  @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;

  public sprintsData;
  refreshChartData() {
    this.calcMetrics();
    var effortPerSP = (this.sprintsData[0].capacity 
      + this.sprintsData[1].capacity
      + this.sprintsData[2].capacity
      + this.sprintsData[3].capacity) / 
      (this.sprintsData[0].storyCompleted 
        + this.sprintsData[1].storyCompleted
        + this.sprintsData[2].storyCompleted
        + this.sprintsData[3].storyCompleted);

    for (var i=0; i < 4; i++) {
      //#1 Velocity vs Capacity Chart
      this.capacityVelocityData[0].data[i] = this.sprintsData[i].storyCompleted;
      this.capacityVelocityData[1].data[i] = this.sprintsData[i].capacity / effortPerSP;
      //this.capacityVelocityData[2].data[i] = 30*i / effortPerSP; --> Determine Budgeted Capacity

      //#2 Velocity vs Capacity Chart
      this.wasteData[0].data[i] = this.sprintsData[i].wasteReqChanges / effortPerSP;
      this.wasteData[1].data[i] = this.sprintsData[i].wasteDesignChanges / effortPerSP;
      this.wasteData[2].data[i] = this.sprintsData[i].wasteProdIssues / effortPerSP;
      this.wasteData[3].data[i] = this.sprintsData[i].wasteDevTeamNotDeveloping / effortPerSP;

      //#3 InSprint Automation
      this.inSprintAutomationData[0].data[i] = this.sprintsData[i].insprintRegression;
      this.inSprintAutomationData[1].data[i] = this.sprintsData[i].insprintAutomated;

      //#4 Defects Rework
      this.defectsReworkData[0].data[i] = this.sprintsData[i].wasteReworkDefects;
    }
    this.charts.forEach((child) => {
      child.chart.update()
    });
  }

  public calcMetrics() {

    this.sprintsData  = 
    [{storyCommited : 0, storyCompleted : 0, storiesReady : 0, defectsLowerPlatform : 0
    , defectsHigherPlatform : 0, capacity : 0, wasteReqChanges : 0, wasteDevTeamNotDeveloping : 0
    , wasteDesignChanges : 0, wasteProdIssues : 0, wasteReworkDefects : 0, insprintNoOfScen : 0
    , insprintRegression : 0, insprintAutomated : 0
    }, 
    {storyCommited : 0, storyCompleted : 0, storiesReady : 0, defectsLowerPlatform : 0
    , defectsHigherPlatform : 0, capacity : 0, wasteReqChanges : 0, wasteDevTeamNotDeveloping : 0
    , wasteDesignChanges : 0, wasteProdIssues : 0, wasteReworkDefects : 0, insprintNoOfScen : 0
    , insprintRegression : 0, insprintAutomated : 0
    },
    {storyCommited : 0, storyCompleted : 0, storiesReady : 0, defectsLowerPlatform : 0
    , defectsHigherPlatform : 0, capacity : 0, wasteReqChanges : 0, wasteDevTeamNotDeveloping : 0
    , wasteDesignChanges : 0, wasteProdIssues : 0, wasteReworkDefects : 0, insprintNoOfScen : 0
    , insprintRegression : 0, insprintAutomated : 0
    },
    {storyCommited : 0, storyCompleted : 0, storiesReady : 0, defectsLowerPlatform : 0
    , defectsHigherPlatform : 0, capacity : 0, wasteReqChanges : 0, wasteDevTeamNotDeveloping : 0
    , wasteDesignChanges : 0, wasteProdIssues : 0, wasteReworkDefects : 0, insprintNoOfScen : 0
    , insprintRegression : 0, insprintAutomated : 0
    }];

    var tempTeamName = "",sprintNo = 0;

    for (var i in this.rowData) {
        if (this.rowData[i].teamName != tempTeamName) {
            tempTeamName = this.rowData[i].teamName;
            sprintNo = 0;
        }

        if (sprintNo < 4) {
            this.sprintsData[sprintNo].capacity += this.rowData[i].capacity;
            this.sprintsData[sprintNo].storyCommited += this.rowData[i].storyCommited;
            this.sprintsData[sprintNo].storyCompleted += this.rowData[i].storyCompleted;
            this.sprintsData[sprintNo].storiesReady += this.rowData[i].storiesReady;
            this.sprintsData[sprintNo].defectsLowerPlatform += this.rowData[i].defectsLowerPlatform;
            this.sprintsData[sprintNo].defectsHigherPlatform += this.rowData[i].defectsHigherPlatform;
            this.sprintsData[sprintNo].wasteReqChanges += this.rowData[i].wasteReqChanges;
            this.sprintsData[sprintNo].wasteDevTeamNotDeveloping += this.rowData[i].wasteDevTeamNotDeveloping;
            this.sprintsData[sprintNo].wasteDesignChanges += this.rowData[i].wasteDesignChanges;
            this.sprintsData[sprintNo].wasteProdIssues += this.rowData[i].wasteProdIssues;
            this.sprintsData[sprintNo].wasteReworkDefects += this.rowData[i].wasteReworkDefects;
            this.sprintsData[sprintNo].insprintNoOfScen += this.rowData[i].insprintNoOfScen;
            this.sprintsData[sprintNo].insprintRegression += this.rowData[i].insprintRegression;
            
            if (this.rowData[i].insprintRegression < this.rowData[i].insprintAutomated) {
              this.sprintsData[sprintNo].insprintAutomated += this.rowData[i].insprintRegression;
            } else {
              this.sprintsData[sprintNo].insprintAutomated += this.rowData[i].insprintAutomated;
            }
        }
        sprintNo++;
    }
}

  postData(event){ 
    var teamName= event.target.teamNameEnter.value;
    var sprintName=event.target.sprintNameEnter.value;
    var sprintStartDate=event.target.startDate.value;
    var sprintEndDate=event.target.endDate.value
    var capacity=event.target.capacityValue.value;
    var storyCommited=event.target.commited.value;
    var storyCompleted=event.target.completed.value;
    var perCompletion=event.target.ratio.value;
    var storiesReady=event.target.readyForSprint.value;
    var defectsLowerPlatform=event.target.nOfDefectInAlfaDelta.value;
    var defectsHigherPlatform= event.target.nOfDefectInBetaAndAbove.value;
    var effortPerSp=event.target.effortForSP.value;
    var wasteReqChanges=event.target.requirementChanges.value;
    var wasteDevTeamNotDeveloping=event.target.devTeamNotDeveloping.value;
    var wasteDesignChanges=event.target.designChanges.value;
    var wasteProdIssues=event.target.prodIssues.value;
    var wasteReworkDefects= event.target.defectsRework.value;
    var perWasteReqChanges= event.target.reqChangesPer.value;
    var perWasteDevTeamNotDeveloping=event.target.devTeamNotDevPer.value;
    var perWasteDesignChanges=event.target.designChangesPer.value;
    var perWasteProdIssues=event.target.prodIssuesPer.value;
    var perDefectRework=event.target.defectsPer.value;
    var insprintNoOfScen=event.target.noOfTestScen.value;
    var insprintRegression=event.target.regScenarios.value;
    var insprintAutomated=event.target.automatedScenarios.value;
    var comments=event.target.comment.value;
    this.httpClient.post('http://localhost:3000/dashboard/postsprintdata', { teamName
                                                                            ,capacity
                                                                            ,storyCommited
                                                                            ,storyCompleted
                                                                            ,storiesReady
                                                                            ,defectsLowerPlatform
                                                                            ,defectsHigherPlatform
                                                                            ,wasteReqChanges
                                                                            ,wasteDevTeamNotDeveloping
                                                                            ,wasteDesignChanges
                                                                            ,wasteProdIssues
                                                                            ,wasteReworkDefects
                                                                            ,insprintNoOfScen
                                                                            ,insprintRegression
                                                                            ,insprintAutomated
                                                                            ,sprintName
                                                                            ,sprintStartDate
                                                                            ,sprintEndDate
                                                                            ,perCompletion
                                                                            ,effortPerSp
                                                                            ,perWasteReqChanges
                                                                            ,perWasteDevTeamNotDeveloping
                                                                            ,perWasteDesignChanges
                                                                            ,perWasteProdIssues
                                                                            ,perDefectRework
                                                                            ,comments
                                                                            })
                                                                        .subscribe(
                                                                            (data:any[]) => {
                                                                              console.log(data);
                                                                            }
                                                                          )
  }
  columnDefs = [
    {
      headerName: "teamName",
      field: "teamName"
    },
    {
      headerName: "sprintName",
      field: "sprintName"
    },
    {
      headerName: "sprintStartDate",
      field: "sprintStartDate"
    },
    {
      headerName: "sprintEndDate",
      field: "sprintEndDate"
    },
    {
      headerName: "capacity",
      field: "capacity"
    },
    {
      headerName: "storyCommited",
      field: "storyCommited"
    },
    {
      headerName: "storyCompleted",
      field: "storyCompleted"
    },
    {
      headerName: "perCompletion",
      field: "perCompletion"
    },
    {
      headerName: "storiesReady",
      field: "storiesReady"
    },
    {
      headerName: "defectsLowerPlatform",
      field: "defectsLowerPlatform"
    },
    {
      headerName: "defectsHigherPlatform",
      field: "TdefectsHigherPlatform"
    },
    {
      headerName: "effortPerSp",
      field: "effortPerSp"
    },
    {
      headerName: "wasteReqChanges",
      field: "wasteReqChanges"
    },
    {
      headerName: "wasteDevTeamNotDeveloping",
      field: "wasteDevTeamNotDeveloping"
    },
    {
      headerName: "wasteDesignChanges",
      field: "wasteDesignChanges"
    },
    {
      headerName: "wasteProdIssues",
      field: "wasteProdIssues"
    },
    {
      headerName: "wasteReworkDefects",
      field: "wasteReworkDefects"
    },
    {
      headerName: "perWasteReqChanges",
      field: "perWasteReqChanges"
    },
    {
      headerName: "perWasteDevTeamNotDeveloping",
      field: "perWasteDevTeamNotDeveloping"
    },
    {
      headerName: "perWasteDesignChanges",
      field: "perWasteDesignChanges"
    },
    {
      headerName: "perWasteProdIssues",
      field: "TperWasteProdIssues"
    },
    {
      headerName: "perDefectRework",
      field: "perDefectRework"
    },
    {
      headerName: "insprintNoOfScen",
      field: "insprintNoOfScen"
    },
    {
      headerName: "insprintRegression",
      field: "insprintRegression"
    },
    {
      headerName: "insprintAutomated",
      field: "DinsprintAutomated"
    },
    {
      headerName: "comments",
      field: "comments"
    }
  ];
}