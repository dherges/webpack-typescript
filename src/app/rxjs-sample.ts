import { Observable } from 'rxjs/Observable';

const textInput = document.getElementById('queryInput');

Observable.merge(
  Observable.fromEvent(textInput, 'keyup'),
  Observable.fromEvent(document, 'DOMContentLoaded')
).map((evt) => evt['target']['value'] ? '' + evt['target'].value : '')
  .debounceTime(200) // <-- Temporaler Operator ... teuflische Sache :)
  .distinctUntilChanged()
  .switchMap((query) => Observable.of(filterAndSort(ITEMS, query)).delay(300))  // Observable<[]>
  .subscribe(
    (next)  => { updateHtml(next) },
    (error) => { console.error("error: ", error) },
    ()      => { console.info("completed. No more events after this.") }
  );

const updateHtml = (items) => {
  document.getElementById('queryResults').innerHTML = itemsToHtml(items);
  document.getElementById('queryResultsCount').innerHTML = items.length;
};



/*

1. Observable mit DOM Event als Quelle erstellen:

Rx.Observable.fromEvent(textInput, 'keyup')
  .subscribe(
    function (next)  { console.log("next event emitted: ", next) },
    function (error) { console.log("error: ", error) },
    function ()      { console.log("completed. No more events after this.") }
  );

var subscription = observable.subscribe(..);  // <-- .subscribe() ist das equivalent zu .addListener()
subscription.unsubscribe();                   // <-- .unsubscribe() <~> .removeListener()


2. Functional Programming: .filter() auf keyCode, .map() von KeyboardEvent auf string

Rx.Observable.fromEvent(textInput, 'keyup')
  .map(function (evt) { return '' + evt.target.value })  // <-- aus Observable<KeyboardEvent> wird für folgende Subscriber ein Observable<string>
  .filter(function (query) { return query.length >= 3 }) // <-- folgende Subsriber erhalten input mit mind. 3 Zeichen
  .subscribe(
    function (next)  { console.log("next event emitted: ", next) },
    function (error) { console.log("error: ", error) },
    function ()      { console.log("completed. No more events after this.") }
  );


3. Nun eine Suche:

Rx.Observable.fromEvent(textInput, 'keyup')
  .do(function (next) { console.log("from source: ", next) })
  .map(function (evt) { return '' + evt.target.value })
  .do(function (next) { console.log("after map: ", next) })
  .filter(function (query) { return query.length >= 3 })
  .do(function (next) { console.log("after filter: ", next) })
  .debounceTime(200) // <-- Temporaler Operator ... teuflische Sache :)
  .do(function (next) { console.log("after debounce: ", next) })
  .distinctUntilChanged()
  .do(function (next) { console.log("after distinctUntilChanged: ", next) })
  .map(function (query) { return filterAndSort(ITEMS, query) })
  .subscribe(
    function (next)  { updateHtml(next) },
    function (error) { console.error("error: ", error) },
    function ()      { console.info("completed. No more events after this.") }
  );


4. Mit "echter" remote query:

Rx.Observable.fromEvent(textInput, 'keyup')
  //.do(function (next) { console.log("from source: ", next) })
  .map(function (evt) { return '' + evt.target.value })
  //.do(function (next) { console.log("after map: ", next) })
  //.filter(function (query) { return query.length >= 3 })
  //.do(function (next) { console.log("after filter: ", next) })
  .auditTime(200)
  .do(function (next) { console.log("after auditTime: ", next) })
  .flatMap(function (query) { // <-- .map() würde ein Observable<Observable<Array>> erzeugen, .flatMap() 'flattened' das inner Observable, sodass ein Observable<Array> returned wird
    console.log("GET /fake?q=" + query);
    return Rx.Observable.of(filterAndSort(ITEMS, query));
  })
  .subscribe(
    function (next)  { updateHtml(next) },
    function (error) { console.error("error: ", error) },
    function ()      { console.info("completed. No more events after this.") }
  );



5. Mit "echterer" remote query:

Rx.Observable.fromEvent(textInput, 'keyup')
  //.do(function (next) { console.log("from source: ", next) })
  .map(function (evt) { return '' + evt.target.value })
  //.do(function (next) { console.log("after map: ", next) })
  //.filter(function (query) { return query.length >= 3 })
  //.do(function (next) { console.log("after filter: ", next) })
  .auditTime(200)
  .do(function (next) { console.log("after auditTime: ", next) })
  .switchMap(function (query) { // <--.switchMap() cancelled die subscriptions vorheriger inner Observables
    console.log("GET /fake?q=" + query);
    return Rx.Observable.of(filterAndSort(ITEMS, query)).delay(400); // <-- .delay() des inner Observable (e.g. network)
  })
  .subscribe(
    function (next)  { updateHtml(next) },
    function (error) { console.error("error: ", error) },
    function ()      { console.info("completed. No more events after this.") }
  );

*/


const ITEMS = [
  { name: 'Snoopy', description: 'Ein Hund', group: 'other' },
  { name: 'Mickey Mouse', description: 'Ein Ducktale', group: 'ducktales' },
  { name: 'Dagobert Duck', description: 'Ein Ducktale', group: 'ducktales'  },
  { name: 'Quax der Bruchpilot', description: 'Ein Ducktale', group: 'ducktales'  },
  { name: 'Daisy Duck', description: 'Ein Ducktale', group: 'ducktales'  },
  { name: 'Baghira', description: 'Eine Katze. Der Schwarze Panther aus dem Dschungelbuch', group: 'dschungelbuch' },
  { name: 'Balu', description: 'Der Bär aus dem Dschungelbuch', group: 'dschungelbuch' },
  { name: 'Shir Khan ', description: 'Eine Katze. Der Tiger aus dem Dschungelbuch', group: 'dschungelbuch' },
  { name: 'Kaa ', description: 'Die Schlange aus dem Dschungelbuch', group: 'dschungelbuch' },
];

function filterAndSort(items, input) {
  return items
    .filter((it) => it.name.toLowerCase().indexOf(input.toLowerCase()) > -1)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function itemsToHtml(items) {
  return items.map((it) => itemToHtml(it)).join('');
}

function itemToHtml(item) {
  var outline = '';
  switch (item.group) {
    case 'ducktales':
      outline = 'card-outline-danger';
      break;
    case 'dschungelbuch':
      outline = 'card-outline-success';
      break;
    default:
    case 'other':
      outline = 'card-outline-primary';
      break;
  }

  return '<div class="card ' + outline + ' text-xs-center"><div class="card-block">' +
    '<h5 class="cart-title">' + item.name + '</h5>' +
    '<p class="cart-text">' + item.description + '</p></div></div>';
}
