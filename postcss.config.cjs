/**
 * https://postcss.org/
 */

module.exports = {
    plugins: [
        require("tailwindcss/nesting"),
        require("tailwindcss"),
        require("autoprefixer"),
    ],
};
