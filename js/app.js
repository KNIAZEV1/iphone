fakeAPICall();

function fakeAPICall() {
    setTimeout(() => {
        createListFromArray(contacts);
    }, 500);
}

//get table DOM element
const table = document.getElementById("placeholder");

const input = document.querySelector('.search-input');
input.addEventListener('input', e => {
    searchContacts(e.target.value);
});

// on input change filter contacts
function searchContacts(term) {
    const filteredData = contacts.filter(el => {
        return el.name.toLowerCase().includes(term) || el.phone.includes(term);
    });
    table.innerHTML = '';
    createListFromArray(filteredData);
}


function createListFromArray(dataArray) {
  dataArray.sort((a,b) => {
      if(a.name < b.name) {
          return - 1;
      } else {
          return 1;
      }
  });
  const list = new VirtualList({
      w: 330,
      h: 600,
      itemHeight: 36,
      items: dataArray,
      generatorFn: function(row) {
          const tr = document.createElement('div');
          const avatar = document.createElement('div');
          //get custom name avatar image
          avatar.innerHTML = '<img src="https://ui-avatars.com/api/?name='+this.items[row].name+'" width="35px">';
          const info = document.createElement('div');
          info.innerHTML = '<img src="img/info-icon.png" width="30px">';
          const phoneTd = document.createElement('div');
          phoneTd.innerHTML = '<p>'+this.items[row].name+'</p><p>'+this.items[row].phone+'</p>';
          tr.append(avatar);
          tr.append(phoneTd);
          tr.append(info);
          tr.addEventListener('click', e => {
            let newUrl = window.location.href.split('/');
            newUrl.pop();
            newUrl.push('contact.html?name=' + this.items[row].name + '&phone=' + this.items[row].phone);
            newUrl = newUrl.join('/');
            window.location.replace(newUrl);
          });
          return tr;
      }
    });

    list.container.style.marginLeft = "auto";
    list.container.style.marginRight = "auto";
    document.getElementById("placeholder").appendChild(list.container);
}
