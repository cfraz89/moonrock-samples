declare var System: any
declare var streamInterface: any
declare var reversePortalInterface: any

import Rx = require('rx')

export class MRHelper {
  window: any

  constructor() {
    this.window = <any>window
  }

  getModule(loadedName: string): any {
    return this.window[loadedName]
  }

  getSubject(moduleName:string, subjectName: string): Rx.Subject<any> {
     return this.getModule(moduleName)[subjectName];
  }

  getObservable(moduleName:string, subjectName: string): Rx.Observable<any> {
     return this.getModule(moduleName)[subjectName];
  }

  loadModule(moduleName: string, loadedName: string) {
    System.import(moduleName).then((mod: any) => {
      this.window[loadedName] = mod.default
      streamInterface.push(true, loadedName)
    });
  }

  portal(loadedName: string, subjectName: string) {
    if (this.getSubject(loadedName, subjectName) == undefined) {
      var portal = new Rx.Subject<any>();
      this.getModule(loadedName)[subjectName] = portal;
    }
  }

  activatePortal(loadedName: string, subjectName: string, serializedInput: string) {
    var data = JSON.parse(serializedInput)
    this.getSubject(loadedName, subjectName).onNext(data)
  }

  reversePortal(loadedName: string, subjectName: string) {
    this.getObservable(loadedName, subjectName).subscribe((data: any)=>{
        reversePortalInterface.onNext(JSON.stringify(data), subjectName)
      })
  }

  portalsGenerated(loadedName: string) {
    this.getModule(loadedName).portalsGenerated()
  }
  portalsLinked(loadedName: string) {
    this.getModule(loadedName).portalsLinked()
  }

  unloadModule(loadedName: string) {
    this.getModule(loadedName).destroy()
    this.window[loadedName] = null
  }
}
