var google    = require('googleapis')
  , calendar  = google.calendar('v3')
  , Q         = require('q')
;

module.exports = {
  /**
   * The main entry point for the Dexter module
   *
   * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
   * @param {AppData} dexter Container for all data used in this workflow.
   */
  run: function(step, dexter) {
    var OAuth2       = google.auth.OAuth2
      , oauth2Client = new OAuth2()
      , access_token = dexter.provider('google').credentials('access_token')
      , self         = this
      , eventText    = step.input('event_text').first()
    ;

    oauth2Client.setCredentials({ access_token: access_token });

    var calOpts = {
      auth: oauth2Client,
      calendarId: 'primary',
      text: eventText
    };

    Q.nfcall(calendar.events.quickAdd, calOpts)
      .then(function (response) {
        console.log(response);

        self.complete({});
      })
      .fail(function (err) {
        self.fail(err);
      })
    ;
  }
};
