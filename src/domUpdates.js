import { account, hydration, sleep, activity, fetchData } from './scripts'
import { Chart, registerables } from 'chart.js/auto';
import { stepChart, wklyHydChart, hydChart } from './chartSetup'
Chart.register(...registerables);


function setupEventListeners(randomUser) {
  window.addEventListener("load", () => {
    displayWelcomeMessage(randomUser);
    displayStepGoal(randomUser);
    updateAccountName(randomUser);
    updateAccountAddress(randomUser);
    updateAccountEmail(randomUser);
    updateAccountStride(randomUser);
    updateAccountStep(randomUser);
    updateAccountFriends(randomUser);
    displaySpecificDayOunces(randomUser.id);
    const averageOunces = getAverageDailyFluidOunces(randomUser.id); 
    displayAverageDailyOunces(averageOunces);
    updateChart(randomUser, userData.users);
  });

  document.querySelector('.nav-bar').addEventListener('click', (e) => {
    if(!e.target.classList.contains('home-button')){
      setTimeout(() => {
        document.querySelector('img').classList.add('faded')
      }, 250);
    } else {
      setTimeout(() => {
        document.querySelector('img').classList.remove('faded')
      }, 250);
    }
  }) 
}

// DOM update functions
function displayWelcomeMessage(user) {
  console.log(user)
  const welcomeMessageElement = document.querySelector('.welcome-message');
  welcomeMessageElement.textContent = `Welcome back, ${user.name.split(' ')[0]}!`;
}

function displayStepGoal(user) {
  const averageStepsElement = document.querySelector('.user-step'); //add whatev we make the class
  averageStepsElement.textContent = `${user.dailyStepGoal}`;
}

function compareStepGoalToAverage(averageStepGoal) {
  const stepGoalComparisonElement = document.querySelector('.average-step');//add whatev we make the class
  stepGoalComparisonElement.textContent = `${averageStepGoal}`;
}

// function to get average step goal from userData
function getAverageStepGoal(users) {
  const totalStepGoal = users.reduce((sum, user) => sum += user.dailyStepGoal, 0);
  return totalStepGoal / users.length;
}

// account-name
function updateAccountName(user) {
  const accountName = document.querySelector('#account-name');
  accountName.textContent = `user: ${user.name}`;
}

// account-address
function updateAccountAddress(user) {
  const accountAddress = document.querySelector('#account-address');
  accountAddress.textContent = `address: ${user.address}`;
}

// account-email
function updateAccountEmail(user) {
  const accountEmail = document.querySelector('#account-email');
  accountEmail.textContent = `email: ${user.email}`;
}

// account-stride
function updateAccountStride(user) {
  const accountStride = document.querySelector('#account-stride');
  accountStride.textContent = `stride length: ${user.strideLength} ft.`;
}

//account-step
function updateAccountStep(user) {
  const accountStep = document.querySelector('#account-step');
  accountStep.textContent = `step goal: ${user.dailyStepGoal} steps`;
}

// account-friends
function updateAccountFriends(user) {
  const accountFriends = document.querySelector('#account-friends');
  accountFriends.textContent = `friends: ${friendIdsToNames(user)}`;
}

function friendIdsToNames(user) {
  var friendArr = user.friends
  var friendNames = user.users.reduce((acc, account) => {
    if (friendArr.includes(account.id)) {
      acc.push(account.name)
    }
    return acc
  }, [])
  return friendNames.join(" - ")
}

function displayAverageDailyOunces(averageOunces) {
  document.getElementById('averageDailyOunces').textContent = `${averageOunces.toFixed(2)} oz`;
}

function displaySpecificDayOunces(userId) {
  const ouncesForMostRecent = getSpecificDay(userId);
  document.getElementById('specificDayOunces').textContent = `${ouncesForMostRecent.toFixed(2)} oz`
  return ouncesForMostRecent.toFixed(2)
}

// function to display weekly hydration data for the random user
function displayWeeklyHydration(userId) {
  const weeklyData = getWeeklyFluidOunces(userId);
  return weeklyData.map((day) => day.numOunces)
}

function updateChart(randomUser, allUsers) {
  const averageStepGoal = getAverageStepGoal(allUsers);
  compareStepGoalToAverage(averageStepGoal);
  const avgDailyHydration = getAverageDailyFluidOunces (randomUser.id);
  const dailyHydration = displaySpecificDayOunces (randomUser.id)
  const weeklyHydration = displayWeeklyHydration(randomUser.id)
  
  stepChart.data.datasets[0].data = [randomUser.dailyStepGoal, averageStepGoal];
  stepChart.options.scales.y.ticks.max = Math.max(randomUser.dailyStepGoal, averageStepGoal) + 500; // Adjust as necessary

  hydChart.data.datasets[0].data = [avgDailyHydration,dailyHydration];
  hydChart.options.scales.x.ticks.max = Math.max(avgDailyHydration,dailyHydration) + 10; // Adjust as necessary

  wklyHydChart.data.datasets[0].data = weeklyHydration;
  wklyHydChart.options.scales.x.ticks.max = Math.max(weeklyHydration) + 10; // Adjust as necessary
  
  hydChart.update();
  wklyHydChart.update();
  stepChart.update();
}

 setupEventListeners();


export {
  displayStepGoal,
  compareStepGoalToAverage,
  updateAccountName,
  updateAccountAddress,
  updateAccountEmail,
  updateAccountStride,
  updateAccountStep,
  updateAccountFriends,
  setupEventListeners
};