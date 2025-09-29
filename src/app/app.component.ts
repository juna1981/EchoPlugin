import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { EchoPlugin } from './plugins/EchoPlugin';
import {  DeviceSpace } from './plugins/DeviceSpace';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    this.testEcho();
  }

  async testEcho() {
    try {
      const res = await EchoPlugin.echo({ value: 'Hola desde Ionic!' });
      console.log('Echo result:', res.value);
    } catch (error) {
      console.error('Error al llamar al plugin nativo EchoPlugin: ', error);
    }

    try {
      // Importa el plugin DeviceSpace
      // Llama a los métodos del plugin
      const freeSpace = await DeviceSpace.getFreeDiskSpace();
      console.log('Free Disk Space:', freeSpace.free);
    } catch (error) {
      
    }
  }
}
