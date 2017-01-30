# homebridge-notification
Create accessories used to send IFTTT notifications using HomeKit Automation

The Homebridge Notification accessory is a simple switch which sends a notification to IFTTT whenever it is toggled On. The Notification accessory is meant to be used in conjunction with HomeKit Automation. A user can program an automation using the Home app to send a notification whenever an event/state (or combination of) occurs. This is done by programming the Automation to set the Notfication accessory state to On. Currently, the Home application only supports native notification from sensors such as Motion Detectors, Presense Sensors, Door Locks, etc.. This Homebridge accessory bridges the gap and allows any HomeKit state to trigger a notification. For example, you can send a notification if the temperature in your home is below a threshold but the thermostat is currently turned off. 

The Home app provides only very limited functionality for programming Automations. There is however an excellent HomeKit app called "Hesperus" which allows the creation of Actions (if/then) based on any HomeKit device state.

## IFTTT Configuration

### "ifttt_api_key"
Your IFTTT API key. Set the key to empty if you do not want to receive notifications.

### "ifttt_event"
The IFTTT Maker Event corresponding to this notification. The "Notification" box should include the ingredients {Value1}{Value2}{Value3}{OccurredAt}.

### "ifttt_message"
The message which is to be sent to IFTTT if the accessory is toggled On. 

### "ifttt_mute_notification_interval_in_sec"
This value specifies how long IFTTT notification should be muted after a trigger. This is to prevent notification flooding if the Automation which triggered the notification is repeated.

