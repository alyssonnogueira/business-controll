import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatSidenavContainer} from '@angular/material';

@Component({
  selector: 'app-sorteio',
  templateUrl: './sorteio.component.html',
  styleUrls: ['./sorteio.component.css']
})
export class SorteioComponent implements OnInit {

  amigoSecreto: string;

  constructor(private activeRoute: ActivatedRoute, private el: ElementRef) { }

  ngOnInit() {

    this.activeRoute.params.subscribe(it => {
        console.log(it.encrypt);
        console.log(atob(it.encrypt));
        this.amigoSecreto = atob(it.encrypt);
    });

    const event = new CustomEvent("close", {
      detail: {
        close: true
      }
    });
    window.dispatchEvent(event);
  }

}
