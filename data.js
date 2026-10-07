export const signTips = [
  { title: 'Red-bordered circles', cue: 'A restriction, not automatically STOP', examples: [5, 16, 19], text: 'A crossed-out arrow or vehicle means that movement or vehicle is prohibited. A number can set a maximum speed, weight, width or length. Some red-bordered circles identify parking permissions or taxi stands, so always read the symbol.' },
  { title: 'Blue circles', cue: 'A required direction or designated route', examples: [129, 132, 28], text: 'White arrows tell you the direction you must follow or which side to pass. Cycle and pedestrian symbols identify the route for those users. A dividing line separates their sides; no dividing line indicates a shared route.' },
  { title: 'Yellow diamonds', cue: 'A hazard ahead', examples: [70, 97, 110], text: 'Expect a bend, junction, narrowing, crossing, animal or other hazard. Slow down as needed and prepare for the symbol shown. A warning about a bend is not the same as a blue circular instruction to turn.' },
  { title: 'Orange diamonds and squares', cue: 'Roadworks and temporary layouts', examples: [31, 38, 52], text: 'Expect workers, temporary signals, lane closures or crossovers. Trace the arrows to see how lanes move. Square lane diagrams are common on dual carriageways and motorways; orange does not mean every sign is simply "roadworks ahead".' },
  { title: 'Blue squares and rectangles', cue: 'Information, routes or lane arrangements', examples: [24, 30, 139], text: 'H identifies a hospital; the motorway symbol identifies motorway information. Bus and tram panels identify special lanes: arrows show whether traffic flows with or against you. Check symbols, operating times and permitted users; blue is not permission for every vehicle to enter.' },
  { title: 'Clearway: red cross on blue', cue: 'No stopping or parking during its operation', examples: [3], text: 'The red cross inside a blue circle identifies a clearway. Do not stop or park during the times shown, apart from the permitted public-service-vehicle passenger exception. Read the accompanying time plate; do not confuse this with a blue mandatory-direction sign or a no-parking sign.' },
  { title: 'STOP and YIELD shapes', cue: 'Recognise these even from the outline', examples: [1], text: 'A red octagon marked STOP requires a complete stop at the stop line, or before entering the junction if there is no line. An inverted red-bordered triangle means YIELD: give way and stop if necessary. The red circle with a white horizontal bar shown here means NO ENTRY, not STOP.' },
  { title: 'Direction-sign backgrounds', cue: 'Blue motorway; green national route', examples: [24], text: 'Blue backgrounds identify motorway directions; green identifies national routes; white identifies regional or local routes; brown identifies tourist destinations. Coloured panels within a sign may refer to a different route ahead. Read the route number and destination too.' },
  { title: 'Bars, numbers and smaller plates', cue: 'The detail changes the meaning', examples: [10, 25, 26], text: 'km/h means speed, m means metres and t means tonnes. A red slash across a motorway symbol marks its end, while a slash across a turn prohibits it. Motorway countdown bars mean 300 m, 200 m and 100 m for three, two and one bars. Small plates can add distance, length, times or exceptions. Do not treat every diagonal stripe as an "end" sign.' },
  { title: 'Rural speed-limit stripes', cue: '60 km/h or slower, not unlimited speed', examples: [], text: 'The Irish rural speed-limit sign is a white circle with a black border and diagonal black parallel lines. Since 7 February 2025 it means a maximum of 60 km/h on the rural local roads affected by the change. Choose a lower speed when conditions require it. This is not a general end-of-all-restrictions sign.' },
  { title: 'Lane diagrams and chevrons', cue: 'Follow the path, not just the arrowhead', examples: [33, 52, 126], text: 'Opposing arrows warn of two-way traffic. Bending or separating arrows show lane shifts or crossovers; a black block can represent an obstruction or central reserve. Black-and-yellow chevrons emphasise the direction of a sharp change in alignment. Compare the whole diagram with the exact sign meaning.' },
  { title: 'White road markings', cue: 'Continuous: restriction; broken: check first', examples: [59, 60, 65], text: 'A continuous centre line restricts crossing and overtaking; a broken line does not make overtaking safe by itself. With continuous and broken lines together, obey the line nearest you. Arrows and lane markings guide positioning. A stop line marks where to stop when required.' },
  { title: 'Yellow road markings', cue: 'Parking, road edge or a box junction', examples: [63, 66, 67], text: 'Single yellow kerbside lines mean no parking during the times shown; double yellow lines mean no parking at any time. A broken yellow edge line marks the road edge or hard shoulder, not a normal traffic lane. Do not enter a yellow box unless your exit is clear, except when turning right and held only by oncoming traffic or other right-turning vehicles.' }
];

const oralPairs = [
  ['What rules apply to a yellow box junction?', "You do not enter it unless you can clear it. You can enter it when turning right if you do not obstruct traffic."],
  ['What does a broken white line on the road mean?', 'You can overtake if it is safe to do so.'],
  ['What does a continuous white line on the road mean?', 'You may not overtake.'],
  ['If there is a continuous white line and a broken white line in the centre of the road, what would you do?', 'Obey the line on the left (the one closest to you).'],
  ['What do double yellow lines on the road mean?', 'No parking at any time.'],
  ['What does a single yellow line on the road mean?', 'No parking at the times shown.'],
  ['What does a broken yellow line on the road mean?', 'Hard shoulder or side of the road.'],
  ['When can you overtake on the left-hand side?', 'When the person in front has indicated to go right and it is safe; when your turn is the next turn left and it is safe; or if traffic in the right-hand lane is moving more slowly than traffic in the left.'],
  ['When should you use dipped headlights?', 'At night in a well-lit area; facing oncoming traffic; behind other traffic; at dusk and dawn; in snow and fog.'],
  ['How would you know a pedestrian crossing at night-time?', 'There would be a flashing amber beacon.'],
  ['What is the legal tyre tread depth requirement?', '1.6 mm.'],
  ['Which people in authority must you stop for if directed?', 'Gardai; a flagman at roadworks; a school warden; a person in charge of animals.'],
  ['Who has right of way on a roundabout?', 'Traffic from the right and traffic already on the roundabout.'],
  ['When is it permissible to cross a continuous white line?', 'For access; in an emergency; when directed by Gardai.'],
  ['How would you check your brake lights are working if you are by yourself?', 'Reverse up to a window and brake; check in the mirror.'],
  ['How would you know no entry from the road markings?', 'A continuous white line with a broken white line behind it.'],
  ['What should you do with your mirror if blinded from behind at night-time?', 'Use night mode on the mirror.'],
  ['What is the speed limit in town and city limits?', '50 km/h.'],
  ['What is the speed limit on the motorway?', '120 km/h.'],
  ['Who has priority at a crossroads of equal importance?', 'Traffic on the right.'],
  ['What should you do if blinded by an oncoming vehicle?', 'Look to the left of your windscreen and slow down. Stop if necessary.'],
  ['What does an amber light mean at traffic lights?', 'Stop unless it is not safe to do so.'],
  ['What does a green light mean at traffic lights?', 'You must proceed with caution.'],
  ['What should you do in fog?', 'Turn on fog lights and slow down. Stop if necessary.'],
  ['When turning right at the end of a one-way street, where should you position your vehicle?', 'Drive as close as possible to the right-hand side of the road.'],
  ['How would you know from driving if your coolant was low?', 'Your engine fan would come on more often.'],
  ['How would you know from driving if your brake fluid was low?', 'Your brakes would feel spongy.'],
  ['What would you do in fog?', 'Turn on fog lights, slow down, and if you still cannot see, stop.']
];

export const oral = oralPairs.map(([question, answer], index) => ({
  id: `oral-${index + 1}`, number: index + 1, type: 'oral', question, answer,
  note: index === 17 ? 'Source answer only: speed limits vary by road and posted signs. Do not treat 50 km/h as a universal town or city limit; check current RSA guidance.'
    : index === 25 ? 'Fan operation is not a reliable coolant-level test. Check the reservoir against MIN/MAX with the engine cold, following the vehicle handbook. Never open a hot coolant system.'
    : index === 26 ? 'Spongy brakes can have several causes. Check the reservoir and warning lights; have unsafe brakes inspected before driving.'
    : [23, 27].includes(index) ? 'Use fog lights only when visibility is seriously reduced and switch them off when visibility improves. Stop only in a safe place.'
    : index === 7 ? 'This is the supplied wording, not permission to undertake whenever you are turning left. Verify the exact permitted circumstances in the Rules of the Road.' : ''
}));

const names1 = [
  'No entry', 'Maximum axle weight 4 t', 'Clearway', 'No straight ahead', 'No right turn', 'No left turn', 'No overtaking', 'No entry for large vehicles (3 t+)',
  'Maximum speed limit 60 km/h', 'Height restriction', 'No U-turn', 'Parking permitted', 'No parking permitted', 'Taxi rank', 'Pedestrianised street', 'Maximum speed 50 km/h',
  'Maximum gross weight (7.5 t)', 'Maximum vehicle length (10.5 m)', 'Maximum vehicle width (2.15 m)', 'No overtaking for 3-axle vehicles', 'No ridden or accompanied horses', 'No bicycles', 'Cul-de-sac',
  'Entry to motorway (M7)', '300 m until the next exit', 'Motorway ends 500 m ahead', 'End of motorway', 'Pedestrians and bicycles only', 'Separate bicycle and pedestrian lanes', 'Hospital 100 m ahead',
  'Roadworks ahead', 'End of roadworks', 'Two-way traffic', 'One-lane crossover (out)', 'One-lane crossover (back)', 'End of central reserve / obstruction', 'Start of central reserve / obstruction',
  'Road narrows from left', 'Road narrows from right', 'Road narrows on both sides', 'Uneven surface', 'Loose chippings', 'Nearside lane (of two) closed', 'Flagman ahead',
  'Temporary traffic signals ahead', 'Two offside lanes (of four) closed', 'Move to right', 'Single lane (for shuttle working)', 'Move to right (one lane)', 'Site access on left', 'Pedestrians cross to left',
  'Lanes diverge at crossover', 'Two-lane crossover (out)', 'Lanes rejoin at crossover', 'Two-lane crossover (back)', 'Site access on right', 'Queues likely', 'Pedestrians cross to right',
  'Drivers must keep left of the continuous white line', 'Drivers must not cross the broken white lines unless safe', 'Edge of carriageway or hard shoulder', 'No entry', 'Traffic must not enter unless box is clear',
  'Continuous white lines ahead', 'Drivers may not cross the lines to overtake', 'Parking prohibited', 'Parking prohibited at times displayed', 'Zebra crossing'
];
const names2 = [
  'Dangerous left corner ahead', 'Dangerous left bend ahead', 'Series of dangerous corners ahead', 'Series of dangerous bends ahead', 'Crossroads ahead', 'Side road on the left ahead', 'T-junction',
  'Y-junction', 'Crossroads ahead with road of less importance', 'Side road of less importance on the left ahead', 'T-junction ahead with road of less importance to the right', 'Y-junction ahead with road of less importance to the right', 'Staggered crossroads', 'Traffic cross-over ahead',
  'Roundabout ahead', 'Crossroads ahead with road of greater importance', 'T-junction ahead with road of greater importance', 'Crossroads with dual carriageway', 'T-junction with dual carriageway', 'Sharp rise ahead', 'Sharp dip ahead',
  'Series of bumps or hollows ahead', 'Steep descent ahead', 'Steep ascent ahead', 'Danger of falling rocks', 'Low-flying aircraft', 'Slippery road ahead', 'School ahead',
  'Road divides', 'Unguarded level crossing ahead', 'Unprotected body of water ahead', 'Traffic signals ahead', 'Beware of sheep', 'Pedestrian crossing ahead', 'Two-way traffic',
  'Dual carriageway ends', 'Level crossing with lights and barriers', 'Merging traffic', 'Merging and diverging traffic', 'Road narrows from the left', 'Road narrows on both sides', 'Road narrows from the right',
  'Overhead electric cables', 'Mini-roundabout ahead', 'Accompanied horses and ponies', 'Beware of cattle', 'Beware of deer or wild animals', 'Guarded level crossing', 'Children crossing (residential)',
  'Tunnel ahead', 'Tram lane crossing ahead', 'Crosswinds', 'Loop road ahead', 'Lane loss', 'Start of passing lane', 'Start of climbing lane',
  'Sharp change of direction to left', 'Low bridge ahead', 'Sharp change of direction to right',
  'Keep left', 'Keep right', 'Pass either side', 'Keep straight ahead', 'Turn right', 'Turn left', 'Turn left ahead',
  'Turn right ahead', 'With-flow bus lane on left', 'With-flow bus lane on right', 'Contra-flow bus lane', 'Tram lane on right', 'Tram lane on left'
];
export const signs = [...names1.map((answer, index) => ({ number: index + 1, answer })), ...names2.map((answer, index) => ({ number: index + 70, answer }))].map(sign => ({
  ...sign, id: `sign-${sign.number}`, type: 'sign', question: 'What does this sign or road marking mean?', image: `/media/sign-${sign.number}.png`,
  note: sign.number === 9 ? 'Source mismatch: the picture is an end-of-speed-restriction sign, but the supplied answer key says "Maximum speed limit 60 km/h". Verify with RSA; this item is not auto-scored.' : ''
}));
export const questions = [...oral, ...signs];
export const controls = ['Lights: full beam, dipped headlights, side lights and fog lights', 'Front and rear window demisters', 'Hazard lights', 'Front and rear wipers and washers', 'Air conditioning', 'Night mode on the rear-view mirror', 'Brake lights: use reflective glass and apply the footbrake', 'Handbrake check: demonstrate following your instructor and vehicle handbook', 'Steering: demonstrate left and right lock'];
export const technical = ['Brake fluid: check the reservoir level; discuss spongy brakes', 'Coolant: check the reservoir with the engine cold', 'Power-steering fluid, if applicable', 'Engine oil: use the dipstick and explain topping up; follow manufacturer service intervals', 'Windscreen washer fluid', 'Tyres: pressure, tread depth, bulges or damage, and spare tyre'];