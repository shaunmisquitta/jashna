// All the invitation's content lives here — edit this file to personalise the card.

export const wedding = {
  bride: "Ashwini",
  groom: "Jason",
  monogram: "AJ",
  // Headline name (tab title / screen readers). The lettering itself is traced artwork: JashnaLettering in components/decor.tsx.
  title: "Jashna",

  // Reception start (drives the countdown, calendar and "Add to calendar"), in IST (+05:30).
  date: "2026-11-15T12:00:00+05:30",
  endDate: "2026-11-15T17:00:00+05:30",

  // Drop an mp3 at public/song.mp3. Until then a soft music-box melody plays instead.
  songUrl: "song.mp3",

  verse: {
    text: "Set me as a seal upon your heart.",
    ref: "Song of Songs 8:6",
  },
  blessing: "With the blessing of God and our parents",
  parents: {
    groom: { label: "Parents of the groom", names: ["Robert Sánchez Soto", "María Sánchez Solís"] },
    bride: { label: "Parents of the bride", names: ["Carlos Mendoza Pérez", "Heidy López Gómez"] },
  },
  inviteLine: "We have the honour of inviting you to our wedding.",

  storyQuote: "“Love wrote our story, and we would love for you to be part of this beautiful chapter.”",

  // Shown side by side.
  events: [
    {
      name: "Haldi",
      icon: "haldi",
      date: "Friday, 13 November 2026",
      time: "6:00 p.m. onwards",
      venue: "Ruby Banquets",
      address: ["Vasai West"],
      mapsUrl: "https://maps.app.goo.gl/qYDcsUjAgw5S6LBV6",
    },
    {
      name: "Reception",
      icon: "reception",
      date: "Sunday, 15 November 2026",
      time: "12:00 p.m. onwards",
      venue: "Sheth Ramji",
      address: ["Matunga East"],
      mapsUrl: "https://maps.app.goo.gl/CXSLQcwV45JS1cgm7",
    },
  ],

  itinerary: [
    { time: "5:00 p.m.", label: "Ceremony", icon: "ceremony" },
    { time: "6:15 p.m.", label: "Cocktail hour / Sunset photos", icon: "cocktail" },
    { time: "7:00 p.m.", label: "Toast", icon: "cheers" },
    { time: "7:30 p.m.", label: "Dinner", icon: "dinner" },
    { time: "9:00 p.m.", label: "Party!", icon: "party" },
    { time: "10:30 p.m.", label: "Coffee, anyone?", icon: "coffee" },
  ],

  rsvp: {
    deadline: "November 1",
    // International number without "+" or spaces, e.g. "919800000000". Leave empty to just show a thank-you.
    whatsapp: "",
  },

  closing: {
    line: "We hope to celebrate with you",
    thanks: "Thank you!",
  },
};

export type Wedding = typeof wedding;
