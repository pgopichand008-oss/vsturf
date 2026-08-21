function timeToMinutes(time) {
  const [timePart, modifier] = time.split(' ');

  let [hours, minutes] = timePart
    .split(':')
    .map(Number);

  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  }

  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}


function minutesToTime(totalMinutes) {
  let hours = Math.floor(
    totalMinutes / 60
  );

  const minutes =
    totalMinutes % 60;

  const modifier =
    hours >= 12 ? 'PM' : 'AM';

  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
  }

  return `${String(hours).padStart(2, '0')}:${String(
    minutes
  ).padStart(2, '0')} ${modifier}`;
}


function generateSlots(
  openingTime,
  closingTime,
  basePrice
) {
  const openingMinutes =
    timeToMinutes(openingTime);

  const closingMinutes =
    timeToMinutes(closingTime);

  const slots = [];

  const SLOT_DURATION = 60;

  for (
    let start = openingMinutes;
    start + SLOT_DURATION <= closingMinutes;
    start += SLOT_DURATION
  ) {
    const end =
      start + SLOT_DURATION;

    const startTime =
      minutesToTime(start);

    const endTime =
      minutesToTime(end);

    let price = basePrice;

    // Evening pricing
    if (start >= 17 * 60) {
      price = 1200;
    }

    slots.push({
      startTime,
      endTime,
      price,
      status: 'Available',
    });
  }

  return slots;
}


module.exports = {
  generateSlots,
};