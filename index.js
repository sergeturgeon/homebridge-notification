var Service;
var Characteristic;

module.exports = function (homebridge)
{
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-notifications", "Notification", NotificationAccessory);
}

function NotificationAccessory(log, config)
{
  this.log = log;
  this.accessoryLabel = config['accessory'];
  this.name = config['name'];

  this.iftttApiKey = config['ifttt_api_key'];
  this.iftttEvent = config['ifttt_event'];
  this.iftttMessage = config['ifttt_message'];
  this.iftttMuteNotificationIntervalInSec = config['ifttt_mute_notification_interval_in_sec'];

  this.log("ifttt api key " + this.iftttApiKey);
  this.log("ifttt event " + this.iftttEvent);
  this.log("ifttt message " + this.iftttMessage);
  this.log("ifttt mute notification interval in sec " + this.iftttMuteNotificationIntervalInSec);

  this.iftttMuted = false;
  this.stateValue = 0;

  this.SendNotificationToIFTTT = function()
  {
    this.log('Send notification to IFTTT: ' + this.iftttMessage);

    var IFTTTMaker = require('iftttmaker')(this.iftttApiKey);

    var request = {
      event: this.iftttEvent,
       values: {
          value1: this.iftttMessage,
          value2: '',
          value3: '',
       }
    }

    IFTTTMaker.send(request, function (error) {
      if (error) {
        this.log('The IFTTTMaker request could not be sent:', error);
      }
    });
  }
}

NotificationAccessory.prototype =
{
  getState: function (callback)
  {
    this.service.setCharacteristic(this.sensor, this.stateValue);
    //this.log('getState '  + this.stateValue);
    callback(null, this.stateValue);
  },
  
  setState: function (value, callback)
  {
    //this.log('setState ' + value);
    this.stateValue = value;

    if (this.stateValue == 1) {
      // 'that' is used inside timeout functions
      that = this;

      // Clear the On value after 250 milliseconds 
      setTimeout(function() {that.stateValue = 0; that.service.setCharacteristic(that.sensor, 0); }, 500 );

      // Send IFTTT notification
      if (this.iftttApiKey) {
         if (this.iftttMuted == false) {
           this.SendNotificationToIFTTT();

           // Mute further notifications for specified time
           this.iftttMuted = true;
           setTimeout(function() {that.iftttMuted = false; that.log("IFTTT un-muted");}, this.iftttMuteNotificationIntervalInSec * 1000);
         }
         else {
           this.log("IFTTT notification is muted");
         }
       }
    }
    callback();
  },

  identify: function (callback)
  {
    this.log("Identify requested!");
    callback();
  },

  getServices: function ()
  {
    var informationService = new Service.AccessoryInformation();

    var pkginfo = require('pkginfo')(module);

    informationService
      .setCharacteristic(Characteristic.Manufacturer, module.exports.author.name)
      .setCharacteristic(Characteristic.Model, this.accessoryLabel)
      .setCharacteristic(Characteristic.SerialNumber, 'Version ' + module.exports.version);

    this.service = new Service.Switch(this.name);

    this.sensor = Characteristic.On;

    this.service
      .getCharacteristic(this.sensor)
      .on('get', this.getState.bind(this));

    this.service
      .getCharacteristic(this.sensor)
      .on('set', this.setState.bind(this));

    this.stateValue = 0;
    this.service.setCharacteristic(this.sensor, this.stateValue);

    return [informationService, this.service];
  }
};
