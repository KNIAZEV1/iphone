fakeAPICall();

function fakeAPICall(){
    setTimeout(() => {
        createListFromArray(callHistory);
    }, 500);
}

//get table DOM element
const table = document.getElementById("placeholder");
let draggingElement = null;

function createListFromArray(dataArray){
  var list = new VirtualList({
      w: 330,
      h: 600,
      itemHeight: 36,
      items: dataArray,
      generatorFn: function(row) {
          var tr = document.createElement('div');
          var burgetIcon = document.createElement('div');
          burgetIcon.innerHTML = '<img src="img/hamburger-icon.png" width="35px">';
          var time = document.createElement('div');
          time.innerHTML = this.items[row].time;
          var phoneTd = document.createElement('div');
          phoneTd.innerHTML = '<p>'+this.items[row].name+'</p><p>'+this.items[row].phone+'</p>';
          tr.append(burgetIcon);
          tr.append(phoneTd);
          tr.append(time);
          tr.setAttribute('draggable', true);
          addRedirect(tr, this.items[row].name, this.items[row].phone);
          addDnDHandlers(tr);
          return tr;
      }
    });

    list.container.style.marginLeft = "auto";
    list.container.style.marginRight = "auto";
    document.getElementById("placeholder").appendChild(list.container);
}

function addDnDHandlers(elem) {
  elem.addEventListener('dragstart', handleDragStart, false);
  elem.addEventListener('dragenter', handleDragEnter, false)
  elem.addEventListener('dragover', handleDragOver, false);
  elem.addEventListener('dragleave', handleDragLeave, false);
  elem.addEventListener('drop', handleDrop, false);
  elem.addEventListener('dragend', handleDragEnd, false);
}

function handleDragStart(e) {
  // Target (this) element is the source node.
  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.outerHTML);

  this.classList.add('dragElem');
}
function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }
  this.classList.add('over');

  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

  return false;
}

function handleDragEnter(e) {
  // this / e.target is the current hover target.
}

function handleDragLeave(e) {
  this.classList.remove('over');  // this / e.target is previous target element.
}

function handleDrop(e) {
  // this/e.target is current target element.
  if (e.stopPropagation) {
    e.stopPropagation(); // Stops some browsers from redirecting.
  }

  // Don't do anything if dropping the same column we're dragging.
  if (dragSrcEl != this) {
    // Set the source column's HTML to the HTML of the column we dropped on.
    this.parentNode.removeChild(dragSrcEl);
    var dropHTML = e.dataTransfer.getData('text/html');
    // Parse HTML and insert into DOM
    this.insertAdjacentHTML('beforebegin', dropHTML);
    var dropElem = this.previousSibling;
    addDnDHandlers(dropElem);
    const name = dropElem.children[1].children[0].innerHTML;
    const phone = dropElem.children[1].children[1].innerHTML;
    addRedirect(dropElem, name, phone);
  }
  this.classList.remove('dragElem');
  this.classList.remove('over');
  return false;
}

function handleDragEnd(e) {
  // this/e.target is the source node.
  this.classList.remove('over');
  this.classList.remove('dragElem');
}

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function addRedirect(el, name, phone) {
  el.addEventListener('click', e => {
    let newUrl = window.location.href.split('/');
    newUrl.pop();
    newUrl.push('contact.html?name=' + name + '&phone=' + phone);
    newUrl = newUrl.join('/');
    window.location.replace(newUrl);
  });
}
