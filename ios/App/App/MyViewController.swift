//
//  MyViewController.swift
//  App
//
//  Created by Juan Carlos Quiles on 22/9/25.
//
import UIKit
import Capacitor

class MainViewController: CAPBridgeViewController {

    override open func capacitorDidLoad() {
      print(">>> EchoPlugin registrado en capacitorDidLoad")
      bridge?.registerPluginInstance(EchoPlugin())
      print(">>> EchoPlugin registrado en capacitorDidLoad")
    }
}
