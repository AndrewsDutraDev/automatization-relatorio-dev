export const Calculate = {
  totalPointsValue: 0,
  totalPoints: function (points) {
    Calculate.totalPointsValue += parseInt(points);
  },
  showTotalPoints: function () {
    console.log(Calculate.totalPointsValue)
    return Calculate.totalPointsValue
  }
};
