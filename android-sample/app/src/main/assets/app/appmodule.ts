import axios = require('axios')
import Rx = require('rx')

function toNumber(source: string): number {
  var num = parseInt(source)
  return isNaN(num) ? 0 : num
}

export class appModule implements MoonRockModule {
  //Forward portals (from the app's native code)
  addPressed: Rx.Observable<any>
  add1Text: Rx.Observable<string>
  add2Text: Rx.Observable<string>

  //Reverse portals (generated here)
  sum: Rx.Observable<string>
  posts: Rx.Observable<any>

  portalsGenerated() {
    var add1Num = this.add1Text.map(toNumber);
    var add2Num = this.add2Text.map(toNumber);
    var sumStream = add1Num.combineLatest(add2Num, (num1, num2) => (num1 + num2).toString())
    this.sum = this.addPressed.withLatestFrom(sumStream, (ev, num) => num)
    this.posts = Rx.Observable.fromPromise(axios.get('http://jsonplaceholder.typicode.com/posts'));
  }

  portalsLinked() {}
  destroy() {}
}

export default (new appModule())
