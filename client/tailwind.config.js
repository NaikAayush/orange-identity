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
      },
    },
  },
  variants: {
    extend: {},
  },
};
