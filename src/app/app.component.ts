import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import * as signalR from '@aspnet/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  Students=[];

  private hubConnection: signalR.HubConnection;

  //change the url in get from https://localhost:5001/results 
  //to https://api-dockerr.herokuapp.com/api/student/GetResults

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl('https://api-dockerr.herokuapp.com/results')
                            .build();
 
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }
 
  public addTransferChartDataListener = () => {
    this.hubConnection.on('NewResults', (data) => {
      this.Students = data;

      this.Students.forEach(element => {
        element.statement= element.pass ==true? "Congrats" : "Hard Luck";
      });
      console.log(data);
    });
  }
 
  //change the url in get from https://localhost:5001/api/student/GetResults 
  //to https://api-dockerr.herokuapp.com/api/student/GetResults

  constructor(private apiCaller: HttpClient){
    this.apiCaller.get('http://api-dockerr.herokuapp.com/api/student/getresults').subscribe((data : []) => {     
      this.Students = data;

      this.Students.forEach(element => {
        element.statement= element.pass ==true? "Congrats" : "Hard Luck";
      });

      this.startConnection();
     this.addTransferChartDataListener();
  
    })
  }
}
