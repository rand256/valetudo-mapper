const Configuration = require("./lib/Configuration");
const MqttClient = require("./lib/MqttClient");
const WebServer = require("./lib/Webserver");
const EventEmitter = require('events');

const args = process.argv.slice(2);

const options = {
    customConfigCreate: args.includes('-c'),
    customConfigPath: args.includes('-f') && args[args.indexOf('-f') + 1] || null
};

const conf = new Configuration(options);
const events = new EventEmitter();

if(conf.get("mqtt")) {
    new MqttClient({
        brokerURL: conf.get("mqtt").broker_url,
        caPath: conf.get("mqtt").caPath,
        identifier: conf.get("mqtt").identifier,
        topicPrefix: conf.get("mqtt").topicPrefix,
        autoconfPrefix: conf.get("mqtt").autoconfPrefix,
        mapSettings: conf.get("mapSettings"),
        mapDataTopic: conf.get("mqtt").mapDataTopic,
        minMillisecondsBetweenMapUpdates: conf.get("mqtt").minMillisecondsBetweenMapUpdates,
        publishMapImage: conf.get("mqtt").publishMapImage,
        publishMapData: conf.get("mqtt").publishMapData,
        webserverEnabled: conf.get("webserver") && conf.get("webserver").enabled === true,
        events: events
    });
    if(conf.get("webserver") && conf.get("webserver").enabled === true) {
        new WebServer({
            port: conf.get("webserver").port,
            events: events
        })
    }
} else {
    console.error("Missing configuration.mqtt");
}