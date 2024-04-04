module.exports = {
  APP_VALIDATIONS: {
    strongPasswordRegex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,
    noWhiteSpaces: /^\S*$/,
  },
};
