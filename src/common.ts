export function formatDate(dateVal: Date) {
  var newDate = new Date(dateVal);

  var sMonth: string | number = padValue(newDate.getMonth() + 1);
  var sDay: string | number = padValue(newDate.getDate());
  var sYear: string | number = newDate.getFullYear();
  var sHour: string | number = newDate.getHours();
  var sMinute: string | number = padValue(newDate.getMinutes());
  var sAMPM: string | number = 'am';

  var iHourCheck: any = sHour;

  if (iHourCheck > 12) {
    sAMPM = 'pm';
    sHour = iHourCheck - 12;
  } else if (iHourCheck === 0) {
    sHour = '12';
  }

  sHour = padValue(sHour);

  return (
    sMonth +
    '-' +
    sDay +
    '-' +
    sYear +
    ' ' +
    sHour +
    ':' +
    sMinute +
    ' ' +
    sAMPM
  );
}

function padValue(value: string | number) {
  return value < 10 ? '0' + value : value;
}
