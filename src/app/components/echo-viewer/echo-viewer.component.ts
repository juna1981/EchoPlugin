import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EchoBridgeService, EchoResponse } from '../../services/echo-bridge.service';

/**
 * Demonstrates how an Ionic/Angular component can leverage the {@link EchoBridgeService}.
 */
@Component({
  selector: 'app-echo-viewer',
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>Electron Echo Demo</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-item>
          <ion-input
            placeholder="Enter text to echo"
            [(ngModel)]="message"
            (keyup.enter)="sendEcho()"
          ></ion-input>
          <ion-button fill="solid" (click)="sendEcho()">Send</ion-button>
        </ion-item>
        <ion-item *ngIf="lastResponse">
          <ion-label>
            <h2>Echoed</h2>
            <p>{{ lastResponse.echoed }}</p>
            <small>Processed at {{ lastResponse.processedAt }}</small>
          </ion-label>
        </ion-item>
      </ion-card-content>
    </ion-card>
  `,
})
export class EchoViewerComponent implements OnInit, OnDestroy {
  /** Holds the current input value from the template two-way binding. */
  public message = '';

  /** Stores the last response for display purposes. */
  public lastResponse: EchoResponse | null = null;

  /** Maintains the subscription to the reactive response stream. */
  private responseSubscription?: Subscription;

  constructor(private readonly echoBridge: EchoBridgeService) {}

  /**
   * Starts listening to the bridge service stream when the component initializes.
   */
  public ngOnInit(): void {
    this.responseSubscription = this.echoBridge.watchResponses().subscribe((response) => {
      this.lastResponse = response;
    });
  }

  /**
   * Sends the message to the native layer using the bridge service.
   */
  public async sendEcho(): Promise<void> {
    if (!this.message?.trim()) {
      return;
    }

    try {
      await this.echoBridge.echo(this.message.trim());
    } catch (error) {
      // In a real application you would surface the error to the user.
      console.error('Failed to send echo request', error);
    }
  }

  /**
   * Ensures subscriptions are cleaned up when the component is destroyed.
   */
  public ngOnDestroy(): void {
    this.responseSubscription?.unsubscribe();
  }
}
