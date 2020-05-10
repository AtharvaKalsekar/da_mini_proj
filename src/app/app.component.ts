import { Component, OnInit, HostListener } from '@angular/core';
import { WinRef } from './win-ref';
import { GlobalStorage } from './global-storage';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'assignment1';
  data : String;

  constructor( private winRef : WinRef){
    
  }

  ngOnInit(): void {

    if(!this.winRef.nativeWindow.name)
    {
      this.winRef.nativeWindow.name = this.getRandomInt(1000);
      
      let activeUsers = localStorage.getItem("activeUsers")? +localStorage.getItem("activeUsers")+1:1;
      localStorage.setItem("activeUsers",String(activeUsers));

      sessionStorage.setItem("windowName",this.winRef.nativeWindow.name);
    }

    else if(this.winRef.nativeWindow.name=="x")
    {
      this.winRef.nativeWindow.name = sessionStorage.getItem("windowName");
  
      let activeUsers = +localStorage.getItem("activeUsers")+1;
      localStorage.setItem("activeUsers",String(activeUsers));

    }
    
    console.log("current window name : ",this.winRef.nativeWindow.name);
    console.log("active users : ",localStorage.getItem("activeUsers"));
    
  }

  @HostListener('window:unload', [ '$event' ])
  unloadHandler(event) {
    
    let activeUsers = +localStorage.getItem("activeUsers")-1;
    localStorage.setItem("activeUsers",String(activeUsers));

    let assignedServer = localStorage.getItem(this.winRef.nativeWindow.name);
    
    if(assignedServer=="s1")
    {
      let sl1 = +localStorage.getItem("serverLoad1");
      localStorage.setItem("serverLoad1",String(sl1-1));
    }
    else if(assignedServer=="s2")
    {
      let sl2 = +localStorage.getItem("serverLoad2");
      localStorage.setItem("serverLoad2",String(sl2-1));
    }
    
    //remover windowname
    localStorage.removeItem(this.winRef.nativeWindow.name);

    this.winRef.nativeWindow.name="x";
    //localStorage.clear();
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  onClickGetData(){

    if(+localStorage.getItem("activeUsers")<7)
    {
      let sl1 = +localStorage.getItem("serverLoad1");
      let sl2 = +localStorage.getItem("serverLoad2");
      let currentWindowName = this.winRef.nativeWindow.name;
      let prevServer = localStorage.getItem(currentWindowName);
      
      //static deterministic load balancing policy
      if((sl1<3 && sl1<=sl2) || prevServer=="s1")
      { 
        //get data from s1
        let s1data = "hello from s1";
        this.data = s1data;

        //update serverLoad1
        sl1 += 1;
        localStorage.setItem("serverLoad1",String(sl1));

        //update local storage window name = server number 
        localStorage.setItem(currentWindowName,"s1");

      }
      else if(sl2<3 && sl2<=sl1 || prevServer=="s2")
      {
        //get data from s2
        let s2data = "hello from s2";
        this.data = s2data;

        //update serverLoad2
        sl2 += 1;
        localStorage.setItem("serverLoad2",String(sl2));

        //update local storage window name = server number
        localStorage.setItem(currentWindowName,"s2");
        
      }
    }
    else
    {
      this.data = "server is loaded. pls try after sometime"      
    }
    console.log("s1 load : ",localStorage.getItem("serverLoad1"));
    console.log("s2 load : ",localStorage.getItem("serverLoad2"));
  }
  
}
