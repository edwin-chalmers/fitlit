import {
  getAverageStepGoal,
  getAccountFriends,
  getAverageDailyFluidOunces,
  getSpecificDay,
  getWeeklyFluidOunces,
  getAverageSleepHours,
  getWeeklySleep,
  getAverageSleepQuality,
  getMostRecentSleepHours,
  getMostRecentSleepQuality,
  getTotalAverageSleepData,
  getTotalAverageNumOunces,
  getTotalAverageActivityData
} from './scripts'
import { Chart, registerables } from 'chart.js/auto';
import { stepChart, wklyHydChart, hydChart, avgSleepChart, sleepChart, wklySleepChart, setCharts, adminChart } from './chartSetup'
Chart.register(...registerables);

function setupEventListeners(randomUser, allUsers) {
  const userFriends = getAccountFriends(randomUser)
  const averageOunces = getAverageDailyFluidOunces(randomUser.id);
  setCharts()
  displayWelcomeMessage(randomUser);
  displayAverageDailyOunces(averageOunces);
  updateAccountName(randomUser);
  updateAccountAddress(randomUser);
  updateAccountEmail(randomUser);
  updateAccountStride(randomUser);
  updateAccountStep(randomUser);
  updateAccountFriends(userFriends);
  sleepChartUpdate(randomUser, allUsers)
  hydrationChartUpdate(randomUser, allUsers)
  stepChartUpdate(randomUser, allUsers)

  const userSelect = document.querySelector('.userSelect')
  const userList = document.querySelector('.userList')
  const viewMenu = document.querySelector('.viewMenu')
  const adminPanel = document.querySelector('.adminControls')
  const adminView = document.querySelector('.adminView')
  const chartOptions = document.querySelector('.chartOptions'); //add these to target the sections
  const chartUpdateSection = document.querySelector('.chartUpdate')
  

  adminView.addEventListener('click', () => {
    adminPanel.classList.toggle('collapsed')
    viewMenu.classList.toggle('hidden')
  })

  const sortContainer = document.querySelector('.sortContainer');
  //const chartOptions = document.querySelector('.chartUpdate');  //moved this up

  // Function to handle drag start event
  function handleDragStart(event) {
      event.dataTransfer.setData('text/plain', event.target.id);
  }

  // Function to handle drag over event
  function handleDragOver(event) {
      event.preventDefault();
  }

  // Function to handle drop event - refactored 
  function handleDrop(event) {
    event.preventDefault();
    const draggableElementId = event.dataTransfer.getData('text/plain');
    const draggableElement = document.getElementById(draggableElementId);
    const target = event.target;

    if(draggableElement.classList.contains('chartOpt')){
      if (target === chartUpdateSection || chartUpdateSection.contains(target)) { //this checks if dropped in the chartUpdateSection
        chartUpdateSection.appendChild(draggableElement);
        adminChartUpdate(draggableElement.id); //call to update the admin chart - we need to flesh out logic for this
      } else {
        chartOptions.appendChild(draggableElement);
      }
    } else {
      sortContainer.appendChild(draggableElement);
    }   
}
  

  // Add event listeners to the sort container
  sortContainer.addEventListener('dragover', handleDragOver);
  sortContainer.addEventListener('drop', handleDrop);
  chartOptions.addEventListener('dragover', handleDragOver);
  chartOptions.addEventListener('drop', handleDrop);
  chartUpdateSection.addEventListener('drop', handleDrop); // Added


  // Add event listeners to draggable elements
  const draggableElements = document.querySelectorAll('.draggable');
  draggableElements.forEach(element => {
      element.addEventListener('dragstart', handleDragStart);
  });

  const users = document.querySelectorAll(".delete")
  userSelect.addEventListener('change', () => {
    userList.innerHTML += `<p class="delete">${userSelect.value}&#x26D4</p>`
      users.forEach((user) => {
      user.addEventListener('dblclick', deleteUser(e))
    })
  })

  function deleteUser(e) {
    console.log(e.target)
  }

  let topNavBar = document.querySelectorAll('.topNav a')
  let sideNavBar = document.querySelectorAll('.sideNav a')
  document.querySelectorAll('nav').forEach((elem) => {
    elem.addEventListener('click', (e) => {
      for (let i = 0; i < topNavBar.length; i++) {
        if (topNavBar[i].classList === e.target.classList || sideNavBar[i].classList === e.target.classList) {
          topNavBar[i].classList.add('underline')
          sideNavBar[i].classList.add('underline')
        } else {
          topNavBar[i].classList.remove('underline')
          sideNavBar[i].classList.remove('underline')
        }
      }
    })
  })

  const debounce = (fn) => {
    let frame;
    return (...params) => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
      frame = requestAnimationFrame(() => {
        fn(...params);
      });

    }
  };

  const storeScroll = () => {
    document.documentElement.dataset.scroll = window.scrollY;
    let opacLevel = 1 - window.scrollY / 1000
    let opacInvert = 1 + window.scrollY / 1000 - 1
    var navBar = document.getElementById('nav-bar')
    var sideBar = document.getElementById('side-nav')
    var logo = document.getElementById("logo")
    navBar.style.opacity = opacLevel
    sideBar.style.opacity = opacInvert
    if (opacLevel > 0.2) {
      logo.style.opacity = `${opacLevel}`
      navBar.classList.remove('hidden')
    } else {
      logo.style.opacity = '0.2'
      navBar.classList.add('hidden')
    }
  }

  document.addEventListener('scroll', debounce(storeScroll), { passive: true });
  storeScroll();
}

// DOM update functions
function displayWelcomeMessage(user) {
  const welcomeMessageElement = document.querySelector('.welcome-message');
  welcomeMessageElement.textContent = `Welcome back, ${user.name.split(' ')[0]}!`;
}

function updateAccountName(user) {
  const accountName = document.querySelector('#account-name');
  accountName.textContent = `${user.name}`;
}

function updateAccountAddress(user) {
  const accountAddress = document.querySelector('#account-address');
  accountAddress.textContent = `${user.address}`;
}

function updateAccountEmail(user) {
  const accountEmail = document.querySelector('#account-email');
  accountEmail.textContent = `${user.email}`;
}

function updateAccountStride(user) {
  const accountStride = document.querySelector('#account-stride');
  accountStride.textContent = `${user.strideLength} ft.`;
}

function updateAccountStep(user) {
  const accountStep = document.querySelector('#account-step');
  accountStep.textContent = `${user.dailyStepGoal} steps`;
}

function updateAccountFriends(friends) {
  const accountFriends = document.querySelector('#account-friends');
  accountFriends.textContent = `${friends}`;
}

        // refactor updateAccountFriends() + updateAccountStep() + updateAccountStride() 
        // + updateAccountName() + updateAccountEmail() + updateAccountAddress()
        function updateAccountData(user) {
          Object.keys(user).forEach(dataType => {
            if (dataType === 'dailyStepGoal') {
              document.querySelector(`#${dataType}`).textContent = `${user[dataType]} steps`;
            } else if (dataType === 'strideLength') {
              document.querySelector(`#${dataType}`).textContent = `${user[dataType]} ft.`;
            } else if (dataType === 'id') { 
              //don't do anything
            } else { 
              document.querySelector(`#${dataType}`).textContent = `${user[dataType]}`;
            }
          })
        }

function displayAverageDailyOunces(averageOunces) {
  return averageOunces.toFixed(2)
}

function displaySpecificDayOunces(userId) {
  const ouncesForMostRecent = getSpecificDay(userId);
  return ouncesForMostRecent
}

function stepChartUpdate(randomUser, allUsers) {
  const averageStepGoal = getAverageStepGoal(allUsers);

  stepChart.data.datasets[0].data = [randomUser.dailyStepGoal, averageStepGoal];
  stepChart.options.scales.y.ticks.max = Math.max(randomUser.dailyStepGoal, averageStepGoal) + 500;

  stepChart.update();
}

function hydrationChartUpdate(randomUser, allUsers) {
  const avgDailyHydration = getAverageDailyFluidOunces(randomUser.id);
  const dailyHydration = displaySpecificDayOunces(randomUser.id)
  const weeklyHydration = getWeeklyFluidOunces(randomUser.id)

  hydChart.data.datasets[0].data = [avgDailyHydration, dailyHydration];
  hydChart.options.scales.x.ticks.max = Math.max(avgDailyHydration, dailyHydration) + 10;

  wklyHydChart.data.datasets[0].data = weeklyHydration.map((day) => { return day.numOunces });
  wklyHydChart.options.scales.x.ticks.max = Math.max(weeklyHydration) + 10;

  wklyHydChart.update()
  hydChart.update()
}

function sleepChartUpdate(randomUser, allUsers) {
  const averageHoursSleptPerDay = getAverageSleepHours(randomUser)
  const averageSleepQuality = getAverageSleepQuality(randomUser)
  const hoursSleptRecentDay = getMostRecentSleepHours(randomUser)
  const sleepQualityRecentDay = getMostRecentSleepQuality(randomUser)

  const selectedDate = document.querySelector('.dateSelector').value
  const sleepWeekAndDay = getWeeklySleep(randomUser, selectedDate)
  const weeklySleepHoursPerDay = sleepWeekAndDay.weeklySleepHours
  const weeklySleepQualityPerDay = sleepWeekAndDay.weeklySleepQuality

  sleepChart.data.datasets[0].data = [hoursSleptRecentDay, sleepQualityRecentDay];
  sleepChart.options.scales.x.ticks.max = Math.max(hoursSleptRecentDay, sleepQualityRecentDay) + 10;

  for (let i = 0; i < 7; i++) {
    wklySleepChart.data.datasets[i].data[0] = weeklySleepHoursPerDay[i]
    wklySleepChart.data.datasets[i].data[1] = weeklySleepQualityPerDay[i]
  }

  avgSleepChart.data.datasets[0].data = [averageHoursSleptPerDay, averageSleepQuality];
  avgSleepChart.options.scales.x.ticks.max = Math.max(averageHoursSleptPerDay, averageSleepQuality) + 10;

  avgSleepChart.update();
  sleepChart.update();
  wklySleepChart.update();
}

//ill give this a shot
function adminChartUpdate() {
  const totalAverageSleep = getTotalAverageSleepData()
  const totalAverageHydration = getTotalAverageNumOunces()
  const totalAverageActivity = getTotalAverageActivityData()
  
  adminChart.data.datasets[0].data = [] //needs to be set
  adminChart.options.scales.x.ticks.max = Math.max() + 10; //same here. outside of numsteps, it seems like minutesactive goes to the highest number

  adminChart.update();

}

export {
  setupEventListeners,
  displayWelcomeMessage,
  updateAccountName,
  updateAccountAddress,
  updateAccountEmail,
  updateAccountStride,
  updateAccountStep,
  updateAccountFriends,
  displaySpecificDayOunces,
  sleepChartUpdate,
};