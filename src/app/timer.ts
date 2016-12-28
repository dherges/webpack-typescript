import * as moment from 'moment';

export class Timer {

  constructor(
   private domElement
  ) {}

  init() {
    setInterval(() => {
      this.domElement.innerHTML = this.getCurrentTime()
    }, 1000)

    console.log('Application inited')
  }

  getCurrentTime(): string {
    return moment().format('MMMM Do YYYY, h:mm:ss a')
  }

}
