import './css/styles.css';
import './images/fitlit-logo.png';
import './images/white-texture.png';
import {  displayStepGoal, compareStepGoalToAverage, updateAccountName, updateAccountAddress, updateAccountEmail, updateAccountStride, updateAccountStep, updateAccountFriends, setupEventListeners} from './domUpdates'
import { fetchUserData, fetchHydrationData, fetchSleepData, fetchActivityData } from './apiCalls';

let randomUser, account, hydration, sleep, activity, averageStepGoal;
fetchData()
function fetchData() {
  Promise.all([
    fetchUserData(),
    fetchHydrationData(),
    fetchSleepData(),
    fetchActivityData(),
  ])
  .then(([account, hydration, sleep, activity]) => {
    randomUser = generateRandomUser(account)
      setupEventListeners(randomUser)
  })
  .catch(error => console.error("Error loading data:", error));
}

function generateRandomUser(account) {
  const randomIndex = Math.floor(Math.random() * account.users.length);
  return account.users[randomIndex];
}
function getAverageStepGoal(user) {
  const totalStepsGoal = account.users.reduce((total, user) => total + user.dailyStepGoal, 0);
  return totalStepsGoal / account.users.length;
}

function getAverageDailyFluidOunces(userId) {
  const userHydrationData = hydration.hydrationData.filter(userRecord => userRecord.userID === userId);
  const totalOunces = userHydrationData.reduce((acc, userRecord) => acc + userRecord.numOunces, 0);
  return totalOunces / userHydrationData.length;
}

function getSpecificDay(userId) {
  const userHydrationData = hydration.hydrationData.filter(record => record.userID === userId);
  const mostRecentRecord = userHydrationData.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  return mostRecentRecord ? mostRecentRecord.numOunces : 0;
}

function getWeeklyFluidOunces(userId) {
  const userHydrationData = hydration.hydrationData.filter(record => record.userID === userId);
  userHydrationData.sort((a, b) => new Date(b.date) - new Date(a.date));
  const lastWeekData = userHydrationData.slice(0, 7);
  return lastWeekData.map(record => ({
    date: record.date,
    numOunces: record.numOunces
  }));

}

console.log(randomUser, averageStepGoal)
export { randomUser, account, hydration, sleep, activity, averageStepGoal, fetchData};
