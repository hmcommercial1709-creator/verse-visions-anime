/**
 * Publisher policy: reading is free; normal ads and privacy messages remain.
 * Install in the initial head, before any Google advertising script.
 * https://developers.google.com/funding-choices/fc-api-docs
 */
export const OFFERWALL_POLICY_SCRIPT = `
window.googlefc = window.googlefc || {};
window.googlefc.controlledMessagingFunction = function(message) {
  var types = window.googlefc.MessageTypeEnum;
  if (types && typeof types.OFFERWALL !== "undefined") {
    message.proceed(false, [types.OFFERWALL]);
  } else {
    // Never block consent or all messaging if the provider API changes.
    message.proceed(true);
  }
};
`;
