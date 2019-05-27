/**
 * Creates a virtually-rendered scrollable list.
 * /- @param {/-object} /-config
 * /- @constructor
 */
function VirtualList(config) {
    var width = (config && config.w + "px") || "100%";
    var height = (this.height = (config && config.h + "px") || "100%");
    var itemHeight = (this.itemHeight = config.itemHeight);

    this.items = config.items;
    this.generatorFn = config.generatorFn;
    this.totalRows = config.totalRows || (config.items && config.items.length);

    var totalHeight = itemHeight * this.totalRows;
    this.scroller = VirtualList.createScroller(totalHeight);
    this.container = VirtualList.createContainer(width, height);

    var screenItemsLen = Math.ceil(config.h / itemHeight);
    // Cache 4 times the number of items that fit in the container viewport
    var cachedItemsLen = screenItemsLen * 3;
    this._renderChunk(this.container, 0, cachedItemsLen / 2);

    var self = this;
    var lastRepaintY;
    var maxBuffer = screenItemsLen * itemHeight;

    function onScroll(e) {
      var scrollTop = e.target.scrollTop;
      var first = parseInt(scrollTop / itemHeight) - screenItemsLen;
      first = first < 0 ? 0 : first;
      if (!lastRepaintY || Math.abs(scrollTop - lastRepaintY) > maxBuffer) {
        self._renderChunk(self.container, first, cachedItemsLen);
        lastRepaintY = scrollTop;
      }

      e.preventDefault && e.preventDefault();
    }

    this.container.addEventListener("scroll", onScroll);
  }

VirtualList.prototype._renderChunk = function(node, fromPos, howMany) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(this.scroller);

  var finalItem = fromPos + howMany;
  if (finalItem > this.totalRows) finalItem = this.totalRows;

  for (var i = fromPos; i < finalItem; i++) {
    var item;
    if (this.generatorFn) item = this.generatorFn(i);
    else {
      if (typeof this.items[i] === "string") {
        var itemText = document.createTextNode(this.items[i]);
        item = document.createElement("div");
        item.style.height = this.height;
        item.appendChild(itemText);
      } else {
        item = this.items[i];
      }
    }

    item.classList.add("vrow");
    fragment.appendChild(item);
  }

  node.innerHTML = "";
  node.appendChild(fragment);
};

VirtualList.createContainer = function(w, h) {
  var c = document.createElement("div");
  c.style.width = w;
  c.style.height = h;
  c.style.overflow = "auto";
  c.style.position = "relative";
  c.style.padding = 0;
  c.style.border = "1px solid black";
  return c;
};

VirtualList.createScroller = function(h) {
  var scroller = document.createElement("div");
  scroller.style.opacity = 0;
  scroller.style.position = "absolute";
  scroller.style.top = 0;
  scroller.style.left = 0;
  scroller.style.width = "1px";
  scroller.style.height = h + "px";
  return scroller;
};

function formatNumber(phone) {
  //if phone number is more than 5 characters format it as +1(234)5
  //but only if doesn't contain brackets (
  if(phone[0] === '+') {
      phone = phone.slice(1,);
  }
  if(phone.length > 4 && !phone.includes('(')) {
      return '+' + phone[0] + '(' + phone.slice(1, 4) + ')' + phone.slice(4,);
  }
  else if(removeBrackets(phone).length > 7 && !phone.includes('-')) {
      return '+' + phone.slice(0,9) + '-' + phone.slice(9,);
  }
  else if(removeBrackets(phone).length > 9 && (phone.match(/-/g) || []).length < 2) {
      return '+' + phone.slice(0,12) + '-' + phone.slice(12,);
  } else {
      return '+' + phone;
  }
}

function removeBrackets(phone) {
  phone = phone.replace(/[()-]/g, "");
  return phone;
}
