// Single source of truth for the invitation's details.
// Components and the /admin message generator all read from here.

export const wedding = {
  groom: {
    name: 'Malith',
    parents: ['Mr. T. H. G. Dayananda', 'Mrs. Nalani Withanage'],
  },
  bride: {
    name: 'Nipunika',
    parents: ['Mr. Priyantha Gunawardhana', 'Mrs. Roshini Gunawardhana'],
  },

  // Sri Lanka time (UTC+05:30)
  date: new Date('2026-12-10T10:00:00+05:30'),
  dateDisplay: '10 . 12 . 2026',
  dateLong: 'Thursday, December 10',
  dateShort: 'December 10, 2026',
  yearInWords: 'The Year Two Thousand Twenty Six',
  monthYear: 'December 2026',

  ceremony: {
    title: 'Poruwa Ceremony',
    time: '10:00 AM',
  },

  venue: {
    name: 'Hotel Radisson Kandy',
    subtitle: 'OZO',
    city: 'Kandy',
    mapUrl: 'https://maps.app.goo.gl/sMwDRxRbyv5ajvti8',
  },

  timeline: [
    { time: '09:00 AM', title: 'Function Starts', desc: 'Welcoming our loved ones to the celebration' },
    { time: '10:00 AM', title: 'Poruwa Ceremony', desc: 'The sacred traditional union upon the Poruwa' },
    { time: '11:15 AM', title: 'Registration', desc: 'Signing of the marriage register' },
    { time: '12:30 PM', title: 'Buffet Opens', desc: 'A celebratory feast with family and friends' },
    { time: '04:00 PM', title: 'Wedding Send Off', desc: 'Bidding farewell as we begin our journey together' },
  ],
} as const;

export const coupleNames = `${wedding.groom.name} & ${wedding.bride.name}`;
