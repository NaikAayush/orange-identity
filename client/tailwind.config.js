module.exports = {
  prefix: "",
  purge: {
    content: ["./src/**/*.{html,ts}"],
  },
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: {
        "weclome-1": "url('assets/welcome/welcome1.png')",
        "weclome-2": "url('assets/welcome/welcome2.png')",
        "dashboard-flight": "url('assets/dashboard/flight.png')",
        "dashboard-hotel": "url('assets/dashboard/hotel.png')",
      },
      colors: {
        custom: {
          100: "#F1F6FB",
          200: "#BBBFD0",
          900: "#092C4C",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
};
