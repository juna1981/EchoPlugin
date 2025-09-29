import { Component } from '@angular/core';
import { EchoPlugin } from 'echo-plugin';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  message = '';
  echoResult = '';

  constructor() {}

  async doEcho() {
    try {
      const result = await EchoPlugin.echo({ value: this.message });
      this.echoResult = result.value;
    } catch (error) {
      console.error('Echo failed:', error);
      this.echoResult = 'Error: ' + error;
    }
  }
}