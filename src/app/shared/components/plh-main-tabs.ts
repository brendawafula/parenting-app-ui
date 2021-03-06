import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "plh-main-tabs",
  template: `<ion-segment (ionChange)="segmentChanged($event)">
    <ion-segment-button value="care-packages" layout="icon-top" (click)="onCarePackagesClicked()">
      <ion-label>Care Packages</ion-label>
      <ion-icon name="heart-outline"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="self-care" layout="icon-top">
      <ion-label>Rewards</ion-label>
      <ion-icon name="star-outline"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="help-me-now" layout="icon-top">
      <ion-label>Help Me Now</ion-label>
      <ion-icon name="help-circle-outline"></ion-icon>
    </ion-segment-button>
  </ion-segment>`,
  styles: [
    `
      ion-segment {
        background: var(--ion-color-primary);
        border-radius: 0px;
      }
      ion-segment-button {
        --color: white;
        --color-checked: white;
        --indicator-height: 0;
        text-transform: unset;
      }
      ion-segment-button:focus {
        outline-width: 0;
      }
    `,
  ],
})
export class PLHMainTabsComponent {

  constructor(private router: Router) {
  }

  segmentChanged(e) {
    console.log("segment changed", e.target.value);
  }

  onCarePackagesClicked() {
    this.router.navigateByUrl("care-packages");
  }
}
