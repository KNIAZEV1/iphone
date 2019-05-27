const numInput = document.querySelector('.numpad-input');
const backspace = document.querySelector('.backspace-icon');
const callBtn = document.querySelector('.call-btn');
const saveBtn = document.querySelector('.save-icon');
const backBtn = document.querySelector('.back-icon');
const table = document.getElementById('placeholder');
const callingMsg = document.querySelector('.calling-msg');
const screenOverlay = document.querySelector('.screen-overlay');

//load phone from params if exists
const params = decodeURI(window.location.search);
const phone = params.split('=')[1];
if(phone) {
    numInput.value = phone;
    enableButton(callBtn);
}

document.querySelectorAll('.numpad-button').forEach(pad => {
    let timeouts = [];
    pad.addEventListener('click', e => {
        if(numInput.value.length >= 16) {
            return;
        }
        const num = parseInt(e.target.innerHTML);
        if(num) {
            numInput.value += num;
            enableButtons(numInput.value);
            numInput.value = formatNumber(numInput.value);
            searchContacts(numInput.value);
        }
        if(num === 0) {
            // set timeout which will be cleared if 0 is pressed second time
            // for double + (double click)
            const timeout = setTimeout(() => {
                numInput.value += num;
                enableButtons(numInput.value);
                numInput.value = formatNumber(numInput.value);
                searchContacts(numInput.value);
            }, 200);
            timeouts.push(timeout);
        }
    });

    //on double click if 0 is clicked
    //clear timeouts if there is any so we don't get those 0 to display
    //we want + instead
    pad.addEventListener('dblclick', e => {
        const num = parseInt(e.target.innerHTML);
        if(num === 0) {
            if(!!timeouts.length) {
                for(t of timeouts) {
                    clearTimeout(t);
                }
            }
            numInput.value += '+';
            enableButtons(numInput.value);
            searchContacts(numInput.value);
        }
    });
});

backspace.addEventListener('click', () => {
    //on backspace click delete last character of number sequence
    if(numInput.value[numInput.value.length - 1] === ')') {
        numInput.value = removeBrackets(numInput.value);
    } else {
        numInput.value = numInput.value.slice(0, numInput.value.length - 1);
    }
    searchContacts(numInput.value);

    //if input value is empty disable save icon and call button
    if(!numInput.value) {
        disableButton(saveBtn);
        disableButton(callBtn);
    } else {
        enableButtons(numInput.value)
    }

});

function disableButton(button) {
    //if there is no disabled-button class add one
    if(!button.className.includes('disabled-button')) {
        button.className += ' disabled-button';
    }
}

function enableButtons(phone) {
    if(isPhoneValid(phone)) {
        enableButton(saveBtn);
        enableButton(callBtn);
    } else {
        disableButton(saveBtn);
        disableButton(callBtn);
    }
}

function enableButton(button) {
    //removes class for disableing button
    button.className = button.className.replace(' disabled-button', '');
}

function isPhoneValid(phone) {
    //check is phone valid starts with optional + and have more than 0 digits
    return !!phone.match(/^[+]*[()-\d]+$/);
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
        h: 150,
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

  // on input change filter contacts
function searchContacts(term) {
    if(term.length === 1 && term[0] === '+') {
        table.innerHTML = '';
        return;
    }
    var filteredData = contacts.filter(function(el) {
        const phone = removeBrackets(el.phone);
        term = removeBrackets(term);
        if(phone === term) {
            disableButton(saveBtn);
        }
        return phone.includes(term);
    });
    table.innerHTML = '';
    if(!!filteredData.length){
        createListFromArray(filteredData);
    }
}

callBtn.addEventListener('click', e => {
    if(isButtonDisabled(callBtn)) {
        return;
    }
    disableScreen();
    addPhoneToCallHistory(numInput.input);
    setTimeout(() => {
        //after 5 sec enable screen
        enableScreen();
    }, 5000);
});

function isButtonDisabled(btn) {
    return btn.className.includes('disabled-button');
}

function disableScreen() {
    callBtn.style.backgroundColor = 'red';
    document.querySelectorAll('.numpad-button').forEach(btn => {
        disableButton(btn);
    });
    disableButton(numInput);
    disableButton(saveBtn);
    disableButton(backBtn);
    disableButton(table);
    show(screenOverlay)
    show(callingMsg);
}

function enableScreen() {
    callBtn.style.backgroundColor = 'green';
    document.querySelectorAll('.numpad-button').forEach(btn => {
        enableButton(btn);
    });
    enableButton(numInput);
    enableButton(saveBtn);
    enableButton(backBtn);
    enableButton(table);
    hide(callingMsg);
    hide(screenOverlay);
}

function hide(el) {
    el.style.display = 'none';
}

function show(el) {
    el.style.display = 'block';
}

function addPhoneToCallHistory(phone) {

}
