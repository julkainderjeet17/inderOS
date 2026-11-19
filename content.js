// ============================================================
//  inderOS CONTENT FILE — edit everything personal here ♥
//  (photos: drop images into /photos and put the path in `src`)
// ============================================================
window.CONTENT = {
  herName: "inder",
  myName: "krish",
  // the day you got together (YYYY-MM-DD) – used for the "days together" widget
  anniversary: "2025-02-14",
  // PIN for the "classified" app (hint shown on lock screen)
  classifiedPin: "1402",
  classifiedHint: "the day it all started (DDMM)",

  reasons: [
    "the way you laugh at your own jokes before finishing them",
    "how you make every boring day feel like a soft movie scene",
    "you remember the tiniest things i say",
    "your sleepy voice at 2am",
    "the way you hold my hand like it's the most normal thing in the world",
    "you're my favourite notification",
    "you make me want to be better without ever asking",
    "your hugs fix things i didn't know were broken",
    "how you get excited about food",
    "simply because you're you"
  ],

  memories: [
    { src: "photos/proposed.webp", emoji: "💍", caption: "day i proposed", date: "" },
    { src: "photos/power-couple.webp", emoji: "⚡", caption: "power couple", date: "" },
    { src: "photos/long-distance.webp", emoji: "✈️", caption: "day before long distance", date: "" },
    { src: "photos/family.webp", emoji: "👨‍👩‍👧‍👦", caption: "our family", date: "" },
    { src: "photos/first-festival.webp", emoji: "🪔", caption: "our first festival together", date: "" },
    { src: "photos/diwali.webp", emoji: "✨", caption: "you're my diwali", date: "" }
  ],

  // `src` can be an mp3 in /music (e.g. "music/song.mp3"). empty = visual only
  songs: [
    // put the mp3 at music/udaarian.mp3 to play inside the OS; `link` opens if no mp3 is found
    { title: "udaarian", artist: "satinder sartaj · our song ♥", src: "music/udaarian.mp3", link: "https://www.youtube.com/results?search_query=udaarian+satinder+sartaj" },
    { title: "late night drive", artist: "for the car rides", src: "" },
    { title: "slow dance", artist: "kitchen at midnight", src: "" },
    { title: "you're my home", artist: "on repeat", src: "" }
  ],

  letters: [
    { emoji: "🥺", title: "open when you're sad", body: "hey you.\n\nfirst, breathe. whatever it is, it's not bigger than you.\n\nyou are so loved, more than you know. i'm one call away, always.\n\n— krish ♥" },
    { emoji: "😤", title: "open when you're mad at me", body: "okay i probably deserved it.\n\nbut remember: i'm on your team. even when we argue, it's us vs the problem, never us vs each other.\n\nnow come here. (after you're done being mad.)" },
    { emoji: "🌙", title: "open when you can't sleep", body: "close your eyes and imagine i'm humming that song badly next to you.\n\ngoodnight, my favourite person." },
    { emoji: "🎉", title: "open when you need to smile", body: "remember the time we laughed so hard we couldn't breathe?\n\nyeah. that's us. that's always going to be us." },
    { emoji: "💌", title: "open when you miss me", body: "i miss you too. probably more.\n\nlook at the sky — same one i'm under. not so far after all." }
  ],

  // classified (unlocked with the PIN)
  secrets: [
    { emoji: "🗝️", title: "the first thing i noticed", body: "your smile. obviously. it wasn't even close." },
    { emoji: "📜", title: "things i never said out loud", body: "i think about our future more than i admit." },
    { emoji: "💍", title: "future_plans.txt", body: "[ access granted ]\n\nstep 1: keep making you happy\nstep 2: ...you'll find out ♥" }
  ],

  dates: [
    { date: "2025-02-14", title: "where it all began", note: "the best decision i ever made" },
    { date: "2025-03-08", title: "first movie together", note: "i didn't watch the movie. i watched you." },
    { date: "2025-08-21", title: "your birthday", note: "the world got lucky that day" },
    { date: "2026-02-14", title: "1 year of us", note: "and counting forever" },
    { date: "2027-02-14", title: "2 years of us", note: "countdown is on" }
  ],

  notes: [
    "drink water, pretty girl 💧",
    "you're doing amazing",
    "i'm proud of you",
    "eat something!!",
    "you + me = ♥"
  ],

  surprises: [
    "🌷 a virtual bouquet, just for you",
    "🎟️ coupon: one free hug. no expiry.",
    "🍕 coupon: i'm buying dinner next time",
    "🎬 coupon: you pick the movie, no complaints",
    "💆 coupon: 10 minute head massage",
    "🧸 a teddy bear hug has been sent to your location",
    "⭐ fun fact: you're my favourite person in the universe",
    "🍫 coupon: chocolate of your choice",
    "🎵 go play udaarian. that's an order.",
    "📞 coupon: one long call where i just listen",
    "🌹 one rose, delivered next time i see you",
    "☕ coupon: i make the chai/coffee, you relax",
    "🛍️ coupon: i carry all the shopping bags. no complaints.",
    "💌 i was thinking about you while making this. (always.)",
    "🍜 coupon: midnight maggi date",
    "📸 coupon: i'll take 50 photos until you like one",
    "🙈 secret: i still get nervous around you sometimes",
    "🚗 coupon: a long drive, your playlist",
    "🧁 coupon: one dessert of your choice, no sharing",
    "✨ reminder: the distance is temporary. us is permanent.",
    "🫶 you just unlocked: +1000 love points",
    "🎀 coupon: you win the next argument automatically"
  ],

  // shown as cute popups while she uses the OS
  notifications: [
    "hey, you're cute. that's it. that's the notification.",
    "reminder: krish loves you",
    "system scan complete: 0 flaws found",
    "battery: 100% charged with love",
    "new message: i miss you already",
    "did you drink water? 👀",
    "your smile has been detected. beautiful.",
    "warning: excessive cuteness levels"
  ],

  // daily login reward — one per day, cycles through
  daily: [
    { emoji: "🌸", text: "today's reminder: you are my favourite thought." },
    { emoji: "📸", text: "today's memory: that time we got lost and it became the best day." },
    { emoji: "🎁", text: "today's surprise: a coupon for one (1) unlimited cuddle session." },
    { emoji: "💌", text: "today's message: i'd choose you in every universe." },
    { emoji: "☀️", text: "today's forecast: 100% chance of me thinking about you." },
    { emoji: "🧁", text: "today's reward: you deserve something sweet. text me, i'm getting it." },
    { emoji: "🌙", text: "today's thought: home isn't a place, it's you." }
  ],

  // terminal secret commands: type these in terminal.exe
  commands: {
    "iloveyou": "i love you more. ♥ (this is not up for debate)",
    "hug": "  (っ◔◡◔)っ ♥ sending hug... delivered.",
    "kiss": "  😘 mwah. transmitted at the speed of love.",
    "why": "because you're you. next question.",
    "forever": "process 'us' set to run forever. no end condition found.",
    "sorry": "apology.exe accepted. cuddles required to finalize.",
    "future": "loading future... 🏡🐶✈️ ...looks bright.",
    "krish": "user krish: creator of this OS. hopelessly in love with the admin."
  }
};
