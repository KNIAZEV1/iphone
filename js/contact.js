const profilePic = document.querySelector('.profile-pic');
const nameInput = document.getElementById('first-name');
const surnameInput = document.getElementById('last-name');
const phoneInput = document.getElementById('phone');
const callBtn = document.querySelector('.call-btn');

const params = decodeURI(window.location.search).split('&');
const name = params[0].split('=')[1];
const phone = params[1].split('=')[1];

const pic = document.createElement('img');
pic.setAttribute('src', 'https://ui-avatars.com/api/?name=' + name);
pic.setAttribute('width', '100px');
profilePic.append(pic);

const nameSplitted = name.split(' ');
nameInput.value = nameSplitted[0];
surnameInput.value = nameSplitted[1];
phoneInput.value = phone;

phoneInput.addEventListener('input', () => {
    phoneInput.value = formatNumber(phoneInput.value);
});

callBtn.addEventListener('click', () => {
    let newUrl = window.location.href.split('/');
    newUrl.pop();
    newUrl.push('numpad.html?phone=' + phone);
    newUrl = newUrl.join('/');
    window.location.replace(newUrl);
});

const callsNumber = callHistory.filter( el => {
    return el.phone === phone;
}).length;

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const today = new Date().getDay();
const data = [0,0,0,0,0,0,0];
data[today] = callsNumber;

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: days,
        datasets: [{
            label: '# of calls per day',
            data: data,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }]
        }
    }
});
