/**
 * https://tailwindcss.com/
 */

const extend = require("./assets/json/theme.extend.json");

module.exports = {
    content: ["./src/**/*.tsx"],
    theme: { extend },
};
