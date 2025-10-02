import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ElectronBridgeService, ElectronMessage } from '../../services/electron-bridge.service';

// Componente de ejemplo que muestra cómo consumir el ElectronBridgeService dentro de una página de Ionic
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html'
})
export class HomePage implements OnInit, OnDestroy {
  // Propiedad que almacena el estado de conexión con Electron
  public estaEnElectron = false;

  // Propiedad que muestra la respuesta recibida desde el proceso principal
  public respuestaProcesoPrincipal = '';

  // Suscripción para gestionar el canal IPC de actualizaciones en caliente
  private actualizacionSub?: Subscription;

  // Se inyecta el servicio de puente dentro del constructor del componente
  constructor(private readonly electronBridge: ElectronBridgeService) {}

  // Método del ciclo de vida de Angular que inicializa la comunicación con Electron
  public ngOnInit(): void {
    this.estaEnElectron = this.electronBridge.estaEnElectron();

    if (!this.estaEnElectron) {
      return;
    }

    // Se registra un listener para recibir mensajes del proceso principal en el canal 'version-info'
    this.actualizacionSub = this.electronBridge
      .escucharCanal<string>('version-info')
      .subscribe((mensaje) => {
        this.respuestaProcesoPrincipal = mensaje;
      });
  }

  // Método que envía un mensaje al proceso principal solicitando información de versión
  public solicitarVersion(): void {
    if (!this.estaEnElectron) {
      return;
    }

    const mensaje: ElectronMessage = {
      canal: 'obtener-version'
    };

    this.electronBridge.enviarMensaje(mensaje);
  }

  // Método que invoca un canal con respuesta usando IPC
  public async solicitarRutaDescargas(): Promise<void> {
    if (!this.estaEnElectron) {
      return;
    }

    const respuesta = await this.electronBridge.invocar<string>({
      canal: 'obtener-ruta-descargas'
    });

    if (respuesta) {
      this.respuestaProcesoPrincipal = respuesta;
    }
  }

  // Método del ciclo de vida de Angular que limpia la suscripción cuando el componente se destruye
  public ngOnDestroy(): void {
    this.actualizacionSub?.unsubscribe();
  }
}
